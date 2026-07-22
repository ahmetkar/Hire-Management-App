import {Worker} from "bullmq"
import redis from "../configs/redis"
import {prisma}  from "@hrmanagement/prisma"
import { generatePrompt, getEmbedding, PromptInput, sendPromptToAgent } from "../helpers/ai.helpers"
import { randomUUID } from "crypto"
import { CreateEmbedIndex, CreateIndex } from "../helpers/elastic.helpers"



function handleError(errormsg:string){
    throw new Error(errormsg)
}
   

const worker1 = new Worker("send-prompt",async(job)=>{

    switch(job.name){
        case "app-one-prompt":
            {
                const data = job.data
                 const personInfo = await prisma.jobapplication.findUnique({where:{id:data.sendedId}})
                
                        if(!personInfo){
                            //return res.status(404).json({message:"İş başvurusu bilgisi bulunamadı."})
                            return handleError("İş başvurusu bilgisi bulunamadı.");
                        }
                
                        if(!personInfo.jobId
                        ){
                
                           // return res.status(404).json({message:"İş başvurusunda iş bilgisi bulunamadı."})
                           return handleError("İş başvurusunda iş bilgisi bulunamadı.");
                        }
                
                        const jobInfo = await prisma.jobs.findUnique({where:{id:personInfo.jobId}})
                
                        if(!jobInfo) {
                            //return res.status(404).json({message:"İş başvurusu yapan kullanıcı için iş bilgisi bulunamadı."})
                             return handleError("İş başvurusu yapan kullanıcı için iş bilgisi bulunamadı.");
                            
                        }

                               
                    
                        if(!personInfo.jobId || !personInfo.university || !personInfo.abilities || !personInfo.unidepartment || !personInfo.address ||
                                    !personInfo.graduatedate || !personInfo.selfbio || !personInfo.county || !personInfo.city || !jobInfo.jobtitle || !jobInfo.jobrequirements
                            ){
                                    console.log(personInfo) 
                                    console.log(jobInfo)
                                    return {success:false,message:""};
                            }
                        
                            const promptInput : PromptInput = {
                                name:personInfo.name,university:personInfo.university,unidepartment:personInfo.unidepartment
                                    ,graduatedate:personInfo.graduatedate.toISOString(),abilities:personInfo.abilities,address:personInfo.address,birthdate:personInfo.birthdate.toISOString()
                                    ,selfbio:personInfo.selfbio,city:personInfo.city,county:personInfo.county,jobtitle:jobInfo.jobtitle,jobrequirements:jobInfo.jobrequirements
                            }
                        
                            const prompt = generatePrompt(promptInput)
                            const response = await sendPromptToAgent(data.role,prompt);
                        
                            const messageOutput = response.outputs.find(output=>output.type == "message.output")
                        
                            if (!messageOutput || !("content" in messageOutput)) {
                                 //return res.status(404).json({message:"AI agentten gelen response da sorun var."})
                                  return handleError("AI agentten gelen response da sorun var.");
                            }
                        
                            const responseText =
                                typeof messageOutput.content === "string"
                                    ? messageOutput.content
                                    : messageOutput.content
                                        .filter(chunk => chunk.type === "text")
                                        .map(chunk => ("text" in chunk ? chunk.text : ""))
                                        .join("");
                                        
                            const embeddingResponse = await getEmbedding(responseText)
                        
                             if(response){
                                await redis.set(`jobapp:${data.sendedId}:embedding`,JSON.stringify(embeddingResponse),"EX",300)  
                                await redis.set(`jobapp:${data.sendedId}:prompt`,prompt,"EX",300)  
                                await redis.set(`sendpromptstatus:${job.id}`,"completed","EX",300)  
                                return {success:true,sendedId:data.sendedId,airesponse:responseText,message:"Başarılı."}
                            }else {
                                 return handleError("Hata response alınamadı.");
                             
                            }
                
            }
        case "staff-one-prompt":{
              const data = job.data
              const personInfo = await prisma.staff.findUnique({where:{id:data.sendedId}})

                if(!personInfo){
                     return handleError("Personel bilgisi bulunamadı.");
                    //return res.status(404).json({message:"Personel bilgisi bulunamadı."})
                }

            if(!personInfo.jobId){
                  return handleError("Personel bilgileri arasında iş bilgisi bulunamadı.");
                //return res.status(404).json({message:"Personel bilgileri arasında iş bilgisi bulunamadı."})
                }

                const jobInfo = await prisma.jobs.findUnique({where:{id:personInfo.jobId}})

                if(!jobInfo) {
                    return handleError("Personel için için iş bilgisi bulunamadı.");
                    //return res.status(404).json({message:"Personel için için iş bilgisi bulunamadı."})
                }

                 if(!personInfo.jobId || !personInfo.university || !personInfo.abilities || !personInfo.unidepartment || !personInfo.address ||
                                    !personInfo.graduatedate || !personInfo.selfbio || !personInfo.county || !personInfo.city || !jobInfo.jobtitle || !jobInfo.jobrequirements
                ){
                                  return handleError("Personel bilgisi bulunamadı.");

                 }
                        
                const promptInput : PromptInput = {
                                name:personInfo.name,university:personInfo.university,unidepartment:personInfo.unidepartment
                                    ,graduatedate:personInfo.graduatedate.toISOString(),abilities:personInfo.abilities,address:personInfo.address,birthdate:personInfo.birthdate.toISOString()
                                    ,selfbio:personInfo.selfbio,city:personInfo.city,county:personInfo.county,jobtitle:jobInfo.jobtitle,jobrequirements:jobInfo.jobrequirements
                            }
                        
                const prompt = generatePrompt(promptInput)
                const response = await sendPromptToAgent(data.role,prompt);
                        
                const messageOutput = response.outputs.find(output=>output.type == "message.output")
                        
                if (!messageOutput || !("content" in messageOutput)) {
                    //return res.status(404).json({message:"AI agentten gelen response da sorun var."})
                     return handleError("AI agentten gelen response da sorun var.");

                }
                        
                const responseText =
                    typeof messageOutput.content === "string"
                            ? messageOutput.content
                            : messageOutput.content
                                        .filter(chunk => chunk.type === "text")
                                        .map(chunk => ("text" in chunk ? chunk.text : ""))
                                        .join("");
                                        
                const embeddingResponse = await getEmbedding(responseText)
                        
                if(response){
                    await redis.set(`staff:${data.sendedId}:embedding`,JSON.stringify(embeddingResponse),"EX",300)  
                    await redis.set(`staff:${data.sendedId}:prompt`,prompt,"EX",300)  
                    await redis.set(`sendpromptstatus:${job.id}`,"completed","EX",300)  
                    return {success:true,sendedId:data.sendedId,airesponse:responseText,message:""}
                 }else {
                    return handleError("Gelen responseda bir sorun var.");
                }
            
        }
        case "app-multi-prompt":
            {
            

            const resultarr : {sendedId:string,result:string}[]  = []
            let resultcount = 0
             let count = 0;
            let errorcount = 0;
            const errorList : string[] = []

            const data = job.data
            await Promise.all(data.idList.map( async (id : string)=>{
                
            
            const personInfo = await prisma.jobapplication.findUnique({where:{id:id}})

                if(!personInfo){
                    //return res.status(404).json({message:"İş başvurusu bilgisi bulunamadı."})
                    errorcount+=1
                    errorList[count] = "İş başvurusu bilgisi bulunamadı."
                    return; 

                }

                if(!personInfo.jobId
                ){

                    //return res.status(404).json({message:"İş başvurusunda iş bilgisi bulunamadı."})
                    errorcount+=1
                    errorList[count] = "İş başvurusunda iş bilgisi bulunamadı."
                    return;

                }

                
                const jobInfo = await prisma.jobs.findUnique({where:{id:personInfo.jobId}})

                if(!jobInfo) {
                    //return res.status(404).json({message:"İş başvurusu yapan kullanıcı için iş bilgisi bulunamadı."})
                    errorcount+=1
                    errorList[count] = "İş başvurusu yapan kullanıcı için iş bilgisi bulunamadı."
                    return;
                }

            

                if(personInfo==null || jobInfo==null){
                    //return res.status(404).json({message:"Personel veya iş başvurusu bilgisi bulunamadı."})
                    errorcount+=1
                    errorList[count] = "Personel veya iş başvurusu bilgisi bulunamadı."
                    return;
               
                }

                if(!personInfo.jobId || !personInfo.university || !personInfo.abilities || !personInfo.unidepartment || !personInfo.address ||
                        !personInfo.graduatedate || !personInfo.selfbio || !personInfo.county || !personInfo.city || !jobInfo.jobtitle || !jobInfo.jobrequirements
                ){

                        //return res.status(404).json({message:"Personel veya iş başvurusu bilgileri bulunamadı."})
                    errorcount+=1
                    errorList[count] = "Personel veya iş başvurusu bilgileri bulunamadı."
                    return;
                }

                const promptInput : PromptInput = {
                    name:personInfo.name,university:personInfo.university,unidepartment:personInfo.unidepartment
                        ,graduatedate:personInfo.graduatedate.toISOString(),abilities:personInfo.abilities,address:personInfo.address,birthdate:personInfo.birthdate.toISOString()
                        ,selfbio:personInfo.selfbio,city:personInfo.city,county:personInfo.county,jobtitle:jobInfo.jobtitle,jobrequirements:jobInfo.jobrequirements
                }
                

                const prompt = generatePrompt(promptInput)
                const response = await sendPromptToAgent(data.role,prompt);

                const messageOutput = response.outputs.find(output=>output.type == "message.output")
                
                if (!messageOutput || !("content" in messageOutput)) {
                   
                    errorcount+=1
                    errorList[count] = "AI agentten gelen sonuçta sorun var"
                    return;
                }

                const responseText =
                    typeof messageOutput.content === "string"
                        ? messageOutput.content
                        : messageOutput.content
                            .filter(chunk => chunk.type === "text")
                            .map(chunk => ("text" in chunk ? chunk.text : ""))
                            .join("");
                            
            
                
                if(responseText){
                    resultcount+=1
                    const embeddingResponse = await getEmbedding(responseText)
                    if(embeddingResponse){
                        resultcount+=1
                        await redis.set(`jobapp:${id}:embedding`,JSON.stringify(embeddingResponse),"EX",300)  
                        await redis.set(`jobapp:${id}:prompt`,prompt,"EX",300) 
                        resultarr.push({sendedId:id,result:responseText})
                    }else {
                        resultarr.push({sendedId:id,result:responseText})
                    }
                }else {
                    errorcount+=1
                    errorList[count] = "Response metininde sorun var"
                    return;
                    
                }
                count+=1
            }));

           
             if(resultcount==0 || errorcount>0){
                 return handleError(`Gelen responseda bir sorun var. ${errorList.join(",")}`);
             
            }
            await redis.set(`sendpromptstatus:${job.id}`,"completed","EX",300)  
            return {success:true,resultarr:resultarr,message:"Başarılı."}
            }
        case "staff-multi-prompt":
            {
          
            const resultarr : {sendedId:string,result:string}[]  = []
            let resultcount = 0
             let count = 0;
            let errorcount = 0;
            const errorList : string[] = []

            
            const data = job.data

            await Promise.all(data.idList.map( async (id : string)=>{
            
        
            const personInfo = await prisma.staff.findUnique({where:{id:id}})

            if(!personInfo){
                //return res.status(404).json({message:"İş başvurusu bilgisi bulunamadı."})
                 errorcount+=1
                errorList[count] = "İş başvurusu bilgisi bulunamadı."
                return; 
            }

            if(!personInfo.jobId
            ){

                //return res.status(404).json({message:"İş başvurusunda iş bilgisi bulunamadı."})
                 errorcount+=1
                errorList[count] = "İş başvurusunda iş bilgisi bulunamadı."
                return; 
            }

            
            const jobInfo = await prisma.jobs.findUnique({where:{id:personInfo.jobId}})

            if(!jobInfo) {
                //return res.status(404).json({message:"İş başvurusu yapan kullanıcı için iş bilgisi bulunamadı."})
                 errorcount+=1
                errorList[count] = "İş başvurusu yapan kullanıcı için iş bilgisi bulunamadı."
                return; 
            }

        

            if(personInfo==null || jobInfo==null){
                //return res.status(404).json({message:"Personel veya iş başvurusu bilgisi bulunamadı."})
                errorcount+=1
                errorList[count] ="Personel veya iş başvurusu bilgisi bulunamadı."
                return; 
            }

            if(!personInfo.jobId || !personInfo.university || !personInfo.abilities || !personInfo.unidepartment || !personInfo.address ||
                    !personInfo.graduatedate || !personInfo.selfbio || !personInfo.county || !personInfo.city || !jobInfo.jobtitle || !jobInfo.jobrequirements
            ){

                    //return res.status(404).json({message:"Personel veya iş başvurusu bilgileri bulunamadı."})
                errorcount+=1
                errorList[count] ="Personel veya iş başvurusu bilgileri bulunamadı."
                return; 
            }

            const promptInput : PromptInput = {
                name:personInfo.name,university:personInfo.university,unidepartment:personInfo.unidepartment
                    ,graduatedate:personInfo.graduatedate.toISOString(),abilities:personInfo.abilities,address:personInfo.address,birthdate:personInfo.birthdate.toISOString()
                    ,selfbio:personInfo.selfbio,city:personInfo.city,county:personInfo.county,jobtitle:jobInfo.jobtitle,jobrequirements:jobInfo.jobrequirements
            }
            

            const prompt = generatePrompt(promptInput)
            const response = await sendPromptToAgent(data.role,prompt);

            const messageOutput = response.outputs.find(output=>output.type == "message.output")
            
            if (!messageOutput || !("content" in messageOutput)) {
                errorcount+=1
                errorList[count] ="Response içeriğinde sroun var."
                return; 
            }

            const responseText =
                typeof messageOutput.content === "string"
                    ? messageOutput.content
                    : messageOutput.content
                        .filter(chunk => chunk.type === "text")
                        .map(chunk => ("text" in chunk ? chunk.text : ""))
                        .join("");
                        
        
            
            if(responseText){
                resultcount+=1
                const embeddingResponse = await getEmbedding(responseText)
                if(embeddingResponse){
                    await redis.set(`staff:${id}:embedding`,JSON.stringify(embeddingResponse),"EX",300)  
                    await redis.set(`staff:${id}:prompt`,prompt,"EX",300) 
                    resultcount+=1
                    resultarr.push({sendedId:id,result:responseText})
                }else {
                    resultarr.push({sendedId:id,result:responseText})
                }
            }else {
                errorcount+=1
                errorList[count] ="Response metninde sorun var."
                return; 
                
            }
            count+=1
            }));

           
            if(resultcount==0 || errorcount > 0){
                  return handleError(`Gelen responseda bir sorun var. ${errorList.join(",")}`);
            }
            await redis.set(`sendpromptstatus:${job.id}`,"completed","EX",300)  
            return {success:true,resultarr:resultarr,message:"Başarılı."}

        }
    }

  return;
},{connection:redis,concurrency:10})


const worker2 = new Worker("save-prompt",async(job)=>{
            switch(job.name){
                case "app-one-save":{
                       const data = job.data
                       if(await CreateIndex()){
                            const prompt = await redis.get(`jobapp:${data.sendedId}:prompt`)
                            const embeddingRedis = await redis.get(`jobapp:${data.sendedId}:embedding`)

                            if(!prompt || !embeddingRedis){
                                  return handleError("Redisten gelen veride sorun var.");

                            }
                            const embeddingObj = JSON.parse(embeddingRedis) as Record<string,unknown>
                            if(embeddingObj==null){
                                return handleError("Redisten gelen veri işlenirken sorun oluştu.");
                            }
                            let embedding = null
                            
                            const embeddingArr = embeddingObj.data as Record<string,unknown>[]
                            embedding = embeddingArr[0].embedding
                            if(embedding == null){
                                return handleError("Redisten gelen veri işlenirken sorun oluştu.");
                            }
                            
                            
                            //index oluştu devam et
                            const elasticId = randomUUID()
                    
                            const elasticResult = await CreateEmbedIndex({id:elasticId,sendedId:data.sendedId,kind:data.kind,embedding:embedding});
                    
                            if(!elasticResult){
                                //return res.status(501).json({message:"ElasticSearch a kaydetme başarısız oldu."})
                                 return handleError("ElasticSearch a kaydetme başarısız oldu.");
                            }

                            const appInfo = await prisma.jobapplication.findUnique({where:{id:data.sendedId}})
                    
                            if(!appInfo){
                                //return res.status(404).json({message:"İş başvurusu bilgisi bulunamadı."})
                                return handleError("İş başvurusu bilgisi bulunamadı.");
                            }
                    
                            const saveprompt = await prisma.aIPrompts.create({data:{kind:data.kind,applicationId:appInfo.id,promptText:prompt,responseText:data.result,elasticId:elasticId}})
                    
                                if(saveprompt){
                                await redis.set(`savepromptstatus:${job.id}`,"completed","EX",300)  
                                return {success:true,message:"Kaydetme başarılı."}
                                }else {
                                     return handleError("Kaydetme başarısız oldu.");
                                }
                       }
                            
                    return;

                }
                case "staff-one-save":
                    {
                      const data = job.data
                      
                       if(await CreateIndex()){
                            const prompt = await redis.get(`staff:${data.sendedId}:prompt`)
                            const embeddingRedis = await redis.get(`staff:${data.sendedId}:embedding`)

                            if(!prompt || !embeddingRedis){
                                return handleError("Redisten gelen veride sorun var.");
                            }
                            const embeddingObj = JSON.parse(embeddingRedis) as Record<string,unknown>
                            if(embeddingObj==null){
                                     return handleError("Redisten gelen veri işlenirken sorun oluştu.");
                            }
                            let embedding = null
                                    
                            const embeddingArr = embeddingObj.data as Record<string,unknown>[]
                            embedding = embeddingArr[0].embedding
                            if(embedding == null){
                                    return handleError("Redisten gelen veri işlenirken sorun oluştu.");
                            }
        
                            //index oluştu devam et
                            const elasticId = randomUUID()
                    
                            const elasticResult = await CreateEmbedIndex({id:elasticId,sendedId:data.sendedId,kind:data.kind,embedding:embedding});
                    
                            if(!elasticResult){
                                //return res.status(501).json({message:"ElasticSearch a kaydetme başarısız oldu."})
                                 return handleError("ElasticSearch a kaydetme başarısız oldu.");
         
                            }

                             const personInfo = await prisma.staff.findUnique({where:{id:data.sendedId}})
                    
                            if(!personInfo){
                                //return res.status(404).json({message:"Personel bilgisi bulunamadı."})

                                return handleError("Personel bilgisi bulunamadı.");
                            }
                            const saveprompt = await prisma.aIPrompts.create({data:{kind:data.kind,staffId:personInfo.id,promptText:prompt,responseText:data.result,elasticId:elasticId}})
                              if(saveprompt){
                                await redis.set(`savepromptstatus:${job.id}`,"completed","EX",300)  
                                return {success:true,message:"Başarıyla kaydedildi.s"}
                                }else {
                                return handleError("Prompt kaydedilirken sorun oluştu.");
                                }
                       }
                    return
                    }
                case "app-multi-save":{
                 
                    const data = job.data
                     let count = 0;
                            let resultcount = 0;
                            let errorcount = 0;
                            const errorList : string[] = []
                        if(await CreateIndex()){
                            
                       
                            data.infoList.map(async (info : any)=>{
                                const prompt = await redis.get(`jobapp:${info.sendedId}:prompt`)
                                const embeddingRedis = await redis.get(`jobapp:${info.sendedId}:embedding`)

                                if(!prompt || !embeddingRedis){
                                     errorcount+=1
                                     errorList[count] = "Redisten gelen veride sorun var."
                                     return; 
                                }
                                const embeddingObj = JSON.parse(embeddingRedis) as Record<string,unknown>
                                if(embeddingObj==null){
                                      errorcount+=1
                                     errorList[count] = "Redisten gelen veri işlenirken sorun oluştu."
                                     return; 
                                
                                }
                                let embedding = null
                                        
                                const embeddingArr = embeddingObj.data as Record<string,unknown>[]
                                embedding = embeddingArr[0].embedding
                                if(embedding == null){
                                       errorcount+=1
                                     errorList[count] = "Redisten gelen veri işlenirken sorun oluştu."
                                     return; 
                                    
                                }
                                const elasticId = randomUUID()
                    
                                const elasticResult = await CreateEmbedIndex({id:elasticId,sendedId:info.sendedId,kind:data.kind,embedding:info.embedding});
                    
                                if(!elasticResult){
                                    //return res.status(501).json({message:"ElasticSearch a kaydetme başarısız oldu."})
                                      errorcount+=1
                                     errorList[count] = "ElasticSearch a kaydetme başarısız oldu."
                                     return; 
                               
                                }

                                 const appInfo = await prisma.jobapplication.findUnique({where:{id:info.sendedId}})
                    
                                if(!appInfo){
                                    //return res.status(404).json({message:"İş başvurusu bilgisi bulunamadı."})
                                     errorcount+=1
                                     errorList[count] = "İş başvurusu bilgisi bulunamadı."
                                     return; 
                            
                                }
                    
                                const saveprompt = await prisma.aIPrompts.create({data:{kind:data.kind,applicationId:appInfo.id,promptText:info.prompt,responseText:info.result,elasticId:elasticId}})
                    
                                    if(saveprompt){
                                        resultcount+=1
                                    }
                    
                                count+=1
                            })
                                
                            if(data.infoList.length == resultcount && errorcount==0){
                                await redis.set(`savepromptstatus:${job.id}`,"completed","EX",300)  
                                 return {success:true,message:"Prompt başarıyla kaydedildi."};
                            }else {
                                 return handleError(`Prompt kaydetme başarısız oldu.. : ${errorList.join(",")}`);
                             
                            }
                             
                    
                        }else {
                    
                             return {success:false,message:"Elastic Searche bağlanmadı.",errorList:[]}
                        }
                }
                case "staff-multi-save":
                {
                            let count = 0;
                            let resultcount = 0;
                            let errorcount = 0;
                            const errorList : string[] = []
                    const data = job.data
                        if(await CreateIndex()){
                            
                           
                            
                            data.infoList.forEach(async (info : any)=>{
                                const prompt = await redis.get(`staff:${info.sendedId}:prompt`)
                                const embeddingRedis = await redis.get(`staff:${info.sendedId}:embedding`)

                                if(!prompt || !embeddingRedis){
                                     errorcount+=1
                                     errorList[count] = "Redisten gelen veride sorun var.."
                                     return; 
                                }
                                const embeddingObj = JSON.parse(embeddingRedis) as Record<string,unknown>
                                if(embeddingObj==null){
                                     errorcount+=1
                                     errorList[count] = "Redisten gelen veri işlenirken sorun oluştu."
                                     return; 
                                        
                                }
                                let embedding = null
                                        
                                const embeddingArr = embeddingObj.data as Record<string,unknown>[]
                                embedding = embeddingArr[0].embedding
                                if(embedding == null){
                                     errorcount+=1
                                     errorList[count] = "Redisten gelen veri işlenirken sorun oluştu."
                                     return; 
                                     
                                }
                                const elasticId = randomUUID()
  
                                const elasticResult = await CreateEmbedIndex({id:elasticId,sendedId:info.sendedId,kind:data.kind,embedding:info.embedding});
                    
                                if(!elasticResult){
                                    //return res.status(501).json({message:"ElasticSearch a kaydetme başarısız oldu."})
                                     errorcount+=1
                                     errorList[count] = "ElasticSearch a kaydetme başarısız oldu."
                                     return; 
                                   
                                }

                                     const personInfo = await prisma.staff.findUnique({where:{id:info.sendedId}})
                    
                                    if(!personInfo){
                                        //return res.status(404).json({message:"Personel bilgisi bulunamadı."})
                                        errorcount+=1
                                        errorList[count] = "Personel bilgisi bulunamadı."
                                        return; 
                                      
                                    }
                                    const saveprompt = await prisma.aIPrompts.create({data:{kind:data.kind,staffId:personInfo.id,promptText:info.prompt,responseText:info.result,elasticId:elasticId}})
                                        if(saveprompt){
                                            resultcount+=1
                                        }

                    
                            count+=1
                            })
                                
                            if(data.infoList.length == resultcount && errorcount==0){
                                await redis.set(`savepromptstatus:${job.id}`,"completed","EX",300)  
                                return {success:true,message:"Prompt dizisi başarıyla kaydedildi.."};
                            }else {
                                  return handleError(`Prompt kaydetme başarısız oldu.. : ${errorList.join(",")}`);
                            }
                    
                        }else {
                    
                               return handleError(`Elastic Searcha bağlanırken sorun oluştu.`);
                        }
                 
                }
            
    }
  return;
},{connection:redis,concurrency:10})




worker1.on("completed",(job)=>{
    console.log("tamamlandı",job.id)
})

worker1.on("failed",(job,error)=>{
    console.log("hata : ",job?.id,"->",error)
})

worker2.on("completed",(job)=>{
    console.log("tamamlandı",job.id)
})

worker2.on("failed",(job,error)=>{
    console.log("hata : ",job?.id,"->",error)
})