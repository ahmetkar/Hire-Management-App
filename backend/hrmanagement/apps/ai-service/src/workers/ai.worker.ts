import {Worker} from "bullmq"
import redis from "../configs/redis"
import {prisma}  from "@hrmanagement/prisma"
import { generatePrompt, getEmbedding, PromptInput, sendPromptToAgent } from "../helpers/ai.helpers"
import { randomUUID } from "crypto"
import { CreateEmbedIndex, CreateIndex } from "../helpers/elastic.helpers"


const worker1 = new Worker("send-prompt",async(job)=>{

    switch(job.name){
        case "app-one-prompt":
            {
                const data = job.data
                 const personInfo = await prisma.jobapplication.findUnique({where:{id:data.sendedId}})
                
                        if(!personInfo){
                            //return res.status(404).json({message:"İş başvurusu bilgisi bulunamadı."})
                            return;
                        }
                
                        if(!personInfo.jobId
                        ){
                
                           // return res.status(404).json({message:"İş başvurusunda iş bilgisi bulunamadı."})
                           return;
                        }
                
                        const jobInfo = await prisma.jobs.findUnique({where:{id:personInfo.jobId}})
                
                        if(!jobInfo) {
                            //return res.status(404).json({message:"İş başvurusu yapan kullanıcı için iş bilgisi bulunamadı."})
                             return;
                        }

                               
                    
                        if(!personInfo.jobId || !personInfo.university || !personInfo.abilities || !personInfo.unidepartment || !personInfo.address ||
                                    !personInfo.graduatedate || !personInfo.selfbio || !personInfo.county || !personInfo.city || !jobInfo.jobtitle || !jobInfo.jobrequirements
                            ){
                                    console.log(personInfo) 
                                    console.log(jobInfo)
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
                                 //return res.status(404).json({message:"AI agentten gelen response da sorun var."})
                                 return;
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
                                return {success:true,sendedId:data.sendedId,airesponse:responseText}
                            }else {
                                return {success:false};
                            }
                
            }
        case "staff-one-prompt":{
              const data = job.data
              const personInfo = await prisma.staff.findUnique({where:{id:data.sendedId}})

                if(!personInfo){
                    return;
                    //return res.status(404).json({message:"Personel bilgisi bulunamadı."})
                }

            if(!personInfo.jobId){
                return;
                //return res.status(404).json({message:"Personel bilgileri arasında iş bilgisi bulunamadı."})
                }

                const jobInfo = await prisma.jobs.findUnique({where:{id:personInfo.jobId}})

                if(!jobInfo) {
                    return;
                    //return res.status(404).json({message:"Personel için için iş bilgisi bulunamadı."})
                }

                 if(!personInfo.jobId || !personInfo.university || !personInfo.abilities || !personInfo.unidepartment || !personInfo.address ||
                                    !personInfo.graduatedate || !personInfo.selfbio || !personInfo.county || !personInfo.city || !jobInfo.jobtitle || !jobInfo.jobrequirements
                ){
                                    console.log(personInfo) 
                                    console.log(jobInfo)
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
                    //return res.status(404).json({message:"AI agentten gelen response da sorun var."})
                        return;
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
                    return {success:true,sendedId:data.sendedId,airesponse:responseText}
                 }else {
                    return {success:false};
                }
            
        }
        case "app-multi-prompt":
            {
            let errorsList = {}

            const resultarr : {sendedId:string,result:string}[]  = []
            let resultcount = 0

            const data = job.data
            await Promise.all(data.idList.map( async (id : string)=>{
                
            
            const personInfo = await prisma.jobapplication.findUnique({where:{id:id}})

                if(!personInfo){
                    //return res.status(404).json({message:"İş başvurusu bilgisi bulunamadı."})
                    errorsList = {...errorsList,[id]:"jobappfault"}
                    return;
                }

                if(!personInfo.jobId
                ){

                    //return res.status(404).json({message:"İş başvurusunda iş bilgisi bulunamadı."})
                    errorsList = {...errorsList,[id]:"jobappfault"}
                    return;
                }

                
                const jobInfo = await prisma.jobs.findUnique({where:{id:personInfo.jobId}})

                if(!jobInfo) {
                    //return res.status(404).json({message:"İş başvurusu yapan kullanıcı için iş bilgisi bulunamadı."})
                    errorsList = {...errorsList,[id]:"jobfault"}
                    return;
                }

            

                if(personInfo==null || jobInfo==null){
                    //return res.status(404).json({message:"Personel veya iş başvurusu bilgisi bulunamadı."})
                    errorsList = {...errorsList,[id]:"infofault"}
                    return;
                }

                if(!personInfo.jobId || !personInfo.university || !personInfo.abilities || !personInfo.unidepartment || !personInfo.address ||
                        !personInfo.graduatedate || !personInfo.selfbio || !personInfo.county || !personInfo.city || !jobInfo.jobtitle || !jobInfo.jobrequirements
                ){

                        //return res.status(404).json({message:"Personel veya iş başvurusu bilgileri bulunamadı."})

                    errorsList = {...errorsList,[id]:"infofault"}
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
                    errorsList = {...errorsList,[id]:"resultfault"}
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
                    errorsList = {...errorsList,[id]:"resultfault"}
                    return;
                    
                }
            }));

            const errors = ["resultfault","stafffault","infofault","jobappfault","elasticfault","jobfault"]
            const errorExists = Object.values(errorsList).some((value)=>(
                errors.includes(value as string)
                ))
            
             if(resultcount==0 || errorExists){
                return {errors:errorsList}
            }

            return {resultarr:resultarr}
            }
        case "staff-multi-prompt":
            {
            let errorsList = {}

            const resultarr : {sendedId:string,result:string}[]  = []
            let resultcount = 0

            
            const data = job.data
            await Promise.all(data.idList.map( async (id : string)=>{
            
        
            const personInfo = await prisma.staff.findUnique({where:{id:id}})

            if(!personInfo){
                //return res.status(404).json({message:"İş başvurusu bilgisi bulunamadı."})
                errorsList = {...errorsList,[id]:"stafffault"}
                return;
            }

            if(!personInfo.jobId
            ){

                //return res.status(404).json({message:"İş başvurusunda iş bilgisi bulunamadı."})
                errorsList = {...errorsList,[id]:"stafffault"}
                return;
            }

            
            const jobInfo = await prisma.jobs.findUnique({where:{id:personInfo.jobId}})

            if(!jobInfo) {
                //return res.status(404).json({message:"İş başvurusu yapan kullanıcı için iş bilgisi bulunamadı."})
                errorsList = {...errorsList,[id]:"jobfault"}
                return;
            }

        

            if(personInfo==null || jobInfo==null){
                //return res.status(404).json({message:"Personel veya iş başvurusu bilgisi bulunamadı."})
                errorsList = {...errorsList,[id]:"infofault"}
                return;
            }

            if(!personInfo.jobId || !personInfo.university || !personInfo.abilities || !personInfo.unidepartment || !personInfo.address ||
                    !personInfo.graduatedate || !personInfo.selfbio || !personInfo.county || !personInfo.city || !jobInfo.jobtitle || !jobInfo.jobrequirements
            ){

                    //return res.status(404).json({message:"Personel veya iş başvurusu bilgileri bulunamadı."})

                errorsList = {...errorsList,[id]:"infofault"}
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
                errorsList = {...errorsList,[id]:"resultfault"}
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
                errorsList = {...errorsList,[id]:"resultfault"}
                return;
                
            }
            }));

            const errors = ["resultfault","stafffault","infofault","jobappfault","elasticfault","jobfault"]
            const errorExists = Object.values(errorsList).some((value)=>(
                errors.includes(value as string)
                ))
            
            if(resultcount==0 || errorExists){
                return {errors:errorsList}
            }

            return {resultarr:resultarr}

        }
    }

  return;
},{connection:redis,concurrency:5})


const worker2 = new Worker("save-prompt",async(job)=>{
            switch(job.name){
                case "app-one-save":{
                       const data = job.data
                       if(await CreateIndex()){
                            const prompt = await redis.get(`jobapp:${data.sendedId}:prompt`)
                            const embeddingRedis = await redis.get(`jobapp:${data.sendedId}:embedding`)

                            if(!prompt || !embeddingRedis){
                                return;
                            }
                            const embeddingObj = JSON.parse(embeddingRedis) as Record<string,unknown>
                            if(embeddingObj==null){
                                return;
                            }
                            let embedding = null
                            
                            const embeddingArr = embeddingObj.data as Record<string,unknown>[]
                            embedding = embeddingArr[0].embedding
                            if(embedding == null){
                                return;
                            }
                            
                            
                            //index oluştu devam et
                            const elasticId = randomUUID()
                    
                            const elasticResult = await CreateEmbedIndex({id:elasticId,sendedId:data.sendedId,kind:data.kind,embedding:embedding});
                    
                            if(!elasticResult){
                                //return res.status(501).json({message:"ElasticSearch a kaydetme başarısız oldu."})
                                return;
                            }

                            const appInfo = await prisma.jobapplication.findUnique({where:{id:data.sendedId}})
                    
                            if(!appInfo){
                                //return res.status(404).json({message:"İş başvurusu bilgisi bulunamadı."})
                                return;
                            }
                    
                            const saveprompt = await prisma.aIPrompts.create({data:{kind:data.kind,applicationId:appInfo.id,promptText:prompt,responseText:data.result,elasticId:elasticId}})
                    
                                if(saveprompt){
                                    
                                return {success:true}
                                }else {
                                return {success:false}
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
                                return;
                            }
                            const embeddingObj = JSON.parse(embeddingRedis) as Record<string,unknown>
                            if(embeddingObj==null){
                                    return;
                            }
                            let embedding = null
                                    
                            const embeddingArr = embeddingObj.data as Record<string,unknown>[]
                            embedding = embeddingArr[0].embedding
                            if(embedding == null){
                                    return;
                            }
        
                            //index oluştu devam et
                            const elasticId = randomUUID()
                    
                            const elasticResult = await CreateEmbedIndex({id:elasticId,sendedId:data.sendedId,kind:data.kind,embedding:embedding});
                    
                            if(!elasticResult){
                                //return res.status(501).json({message:"ElasticSearch a kaydetme başarısız oldu."})
                                return;
                            }

                             const personInfo = await prisma.staff.findUnique({where:{id:data.sendedId}})
                    
                            if(!personInfo){
                                //return res.status(404).json({message:"Personel bilgisi bulunamadı."})
                                return;
                            }
                            const saveprompt = await prisma.aIPrompts.create({data:{kind:data.kind,staffId:personInfo.id,promptText:prompt,responseText:data.result,elasticId:elasticId}})
                              if(saveprompt){
                                    
                                return {success:true}
                                }else {
                                return {success:false}
                                }
                       }
                    return
                    }
                case "app-multi-save":{
                 
                    const data = job.data
                        if(await CreateIndex()){
                            
                            let successList = {}
                    
                            data.infoList.map(async (info : any)=>{
                                const prompt = await redis.get(`jobapp:${info.sendedId}:prompt`)
                                const embeddingRedis = await redis.get(`jobapp:${info.sendedId}:embedding`)

                                if(!prompt || !embeddingRedis){
                                    return;
                                }
                                const embeddingObj = JSON.parse(embeddingRedis) as Record<string,unknown>
                                if(embeddingObj==null){
                                        return;
                                }
                                let embedding = null
                                        
                                const embeddingArr = embeddingObj.data as Record<string,unknown>[]
                                embedding = embeddingArr[0].embedding
                                if(embedding == null){
                                        return;
                                }
                                const elasticId = randomUUID()
                    
                                const elasticResult = await CreateEmbedIndex({id:elasticId,sendedId:info.sendedId,kind:data.kind,embedding:info.embedding});
                    
                                if(!elasticResult){
                                    //return res.status(501).json({message:"ElasticSearch a kaydetme başarısız oldu."})
                                    successList = {...successList,[info.sendedId]:"elasticfault"}
                                    return;
                                }

                                 const appInfo = await prisma.jobapplication.findUnique({where:{id:info.sendedId}})
                    
                                if(!appInfo){
                                    //return res.status(404).json({message:"İş başvurusu bilgisi bulunamadı."})
                    
                                    successList = {...successList,[info.sendedId]:"jobappfault"}
                    
                                    return;
                                }
                    
                                const saveprompt = await prisma.aIPrompts.create({data:{kind:data.kind,applicationId:appInfo.id,promptText:info.prompt,responseText:info.result,elasticId:elasticId}})
                    
                                    if(saveprompt){
                                       successList = {...successList,[info.sendedId]:"added"}
                                    }else {
                                       successList = {...successList,[info.sendedId]:"notadded"}
                                    }
                    
                                
                            })
                                
                            const errors = ["notadded","stafffault","jobappfault","elasticfault"]
                            const errorExists = Object.values(successList).some((value)=>(
                               errors.includes(value as string)
                            ))
                    
                            if(errorExists){
                                return {success:true,successList:successList,message:""}
                            }else {
                                 return {success:false,successList:successList,message:""}
                            }
                    
                        }else {
                    
                             return {success:false,message:"Elastic Searche bağlanmadı.",successList:[]}
                        }
                }
                case "staff-multi-save":
                {
                   
                    const data = job.data
                        if(await CreateIndex()){
                            
                            let successList = {}
                    
                            data.infoList.map(async (info : any)=>{
                                const prompt = await redis.get(`staff:${info.sendedId}:prompt`)
                                const embeddingRedis = await redis.get(`staff:${info.sendedId}:embedding`)

                                if(!prompt || !embeddingRedis){
                                    return;
                                }
                                const embeddingObj = JSON.parse(embeddingRedis) as Record<string,unknown>
                                if(embeddingObj==null){
                                        return;
                                }
                                let embedding = null
                                        
                                const embeddingArr = embeddingObj.data as Record<string,unknown>[]
                                embedding = embeddingArr[0].embedding
                                if(embedding == null){
                                        return;
                                }
                                const elasticId = randomUUID()
  
                                const elasticResult = await CreateEmbedIndex({id:elasticId,sendedId:info.sendedId,kind:data.kind,embedding:info.embedding});
                    
                                if(!elasticResult){
                                    //return res.status(501).json({message:"ElasticSearch a kaydetme başarısız oldu."})
                                    successList = {...successList,[info.sendedId]:"elasticfault"}
                                    return;
                                }

                                     const personInfo = await prisma.staff.findUnique({where:{id:info.sendedId}})
                    
                                    if(!personInfo){
                                        //return res.status(404).json({message:"Personel bilgisi bulunamadı."})
                    
                                        successList = {...successList,[info.sendedId]:"stafffault"}
                                        return;
                                    }
                                    const saveprompt = await prisma.aIPrompts.create({data:{kind:data.kind,staffId:personInfo.id,promptText:info.prompt,responseText:info.result,elasticId:elasticId}})
                                        if(saveprompt){
                                        successList = {...successList,[info.sendedId]:"added"}
                                        }else {
                                           successList = {...successList,[info.sendedId]:"notadded"}
                                        }

                    
                                
                            })
                                
                            const errors = ["notadded","stafffault","jobappfault","elasticfault"]
                            const errorExists = Object.values(successList).some((value)=>(
                               errors.includes(value as string)
                            ))
                    
                            if(errorExists){
                                return {success:true,successList:successList,message:""}
                            }else {
                                 return {success:false,successList:successList,message:""}
                            }
                    
                        }else {
                    
                             return {success:false,message:"Elastic Searche bağlanmadı.",successList:[]}
                        }
                 
                }
            
    }
  return;
},{connection:redis,concurrency:5})




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