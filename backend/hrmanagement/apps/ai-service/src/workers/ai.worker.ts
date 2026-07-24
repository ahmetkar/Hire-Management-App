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
                const data = job.data.data
                 const personInfo = await prisma.jobapplication.findUnique({where:{id:data.id}})
                
                        if(!personInfo){
                            //return res.status(404).json({message:"İş başvurusu bilgisi bulunamadı."})
                               await redis.set(`sendpromptstatus:${job.id}`,"failed","EX",300)  
                            return handleError("İş başvurusu bilgisi bulunamadı.");
                        }
                
                        if(!personInfo.jobId
                        ){
                
                           // return res.status(404).json({message:"İş başvurusunda iş bilgisi bulunamadı."})
                              await redis.set(`sendpromptstatus:${job.id}`,"failed","EX",300)  
                           return handleError("İş başvurusunda iş bilgisi bulunamadı.");
                        }
                
                        const jobInfo = await prisma.jobs.findUnique({where:{id:personInfo.jobId}})
                
                        if(!jobInfo) {
                            //return res.status(404).json({message:"İş başvurusu yapan kullanıcı için iş bilgisi bulunamadı."})
                               await redis.set(`sendpromptstatus:${job.id}`,"failed","EX",300)  
                             return handleError("İş başvurusu yapan kullanıcı için iş bilgisi bulunamadı.");
                            
                        }

                               
                    
                        if(!personInfo.jobId || !personInfo.university || !personInfo.abilities || !personInfo.unidepartment || !personInfo.address ||
                                    !personInfo.graduatedate || !personInfo.selfbio || !personInfo.county || !personInfo.city || !jobInfo.jobtitle || !jobInfo.jobrequirements
                            ){
                                    console.log(personInfo) 
                                    console.log(jobInfo)
                                       await redis.set(`sendpromptstatus:${job.id}`,"failed","EX",300)  
                                     return handleError("İş başvurusu yapan kullanıcı  bilgiler eksik.");
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
                                    await redis.set(`sendpromptstatus:${job.id}`,"failed","EX",300)  
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
                                await redis.set(`jobapp:${data.id}:embedding`,JSON.stringify(embeddingResponse),"EX",300)  
                                await redis.set(`jobapp:${data.id}:prompt`,prompt,"EX",300)  
                                await redis.set(`sendpromptstatus:${job.id}`,"completed","EX",300)  
                                return {success:true,sendedId:data.id,airesponse:responseText,message:"Başarılı."}
                            }else {
                                await redis.set(`sendpromptstatus:${job.id}`,"failed","EX",300)  
                                 return handleError("Hata response alınamadı.");
                             
                            }
                
            }
        case "staff-one-prompt":{
              const data = job.data.data
              const personInfo = await prisma.staff.findUnique({where:{id:data.id}})

                if(!personInfo){
                       await redis.set(`sendpromptstatus:${job.id}`,"failed","EX",300)  
                     return handleError("Personel bilgisi bulunamadı.");
                    //return res.status(404).json({message:"Personel bilgisi bulunamadı."})
                }

            if(!personInfo.jobId){
                   await redis.set(`sendpromptstatus:${job.id}`,"failed","EX",300)  
                  return handleError("Personel bilgileri arasında iş bilgisi bulunamadı.");
                //return res.status(404).json({message:"Personel bilgileri arasında iş bilgisi bulunamadı."})
                }

                const jobInfo = await prisma.jobs.findUnique({where:{id:personInfo.jobId}})

                if(!jobInfo) {
                       await redis.set(`sendpromptstatus:${job.id}`,"failed","EX",300)  
                    return handleError("Personel için için iş bilgisi bulunamadı.");
                    //return res.status(404).json({message:"Personel için için iş bilgisi bulunamadı."})
                }

                 if(!personInfo.jobId || !personInfo.university || !personInfo.abilities || !personInfo.unidepartment || !personInfo.address ||
                                    !personInfo.graduatedate || !personInfo.selfbio || !personInfo.county || !personInfo.city || !jobInfo.jobtitle || !jobInfo.jobrequirements
                ){   await redis.set(`sendpromptstatus:${job.id}`,"failed","EX",300)  
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
                       await redis.set(`sendpromptstatus:${job.id}`,"failed","EX",300)  
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
                    await redis.set(`staff:${data.id}:embedding`,JSON.stringify(embeddingResponse),"EX",300)  
                    await redis.set(`staff:${data.id}:prompt`,prompt,"EX",300)  
                    await redis.set(`sendpromptstatus:${job.id}`,"completed","EX",300)  
                    return {success:true,sendedId:data.id,airesponse:responseText,message:""}
                 }else {
                     await redis.set(`sendpromptstatus:${job.id}`,"failed","EX",300)  
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

            const data = job.data.data
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
                    console.log(personInfo," ",jobInfo)
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
                await redis.set(`sendpromptstatus:${job.id}`,"failed","EX",300) 
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

            
            const data = job.data.data

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
                await redis.set(`sendpromptstatus:${job.id}`,"failed","EX",300)  
                  return handleError(`Gelen responseda bir sorun var. ${errorList.join(",")}`);
            }
            await redis.set(`sendpromptstatus:${job.id}`,"completed","EX",300)  
            return {success:true,resultarr:resultarr,message:"Başarılı."}

        }
    }


},{connection:redis,concurrency:10})



worker1.on("completed",(job)=>{
    console.log("tamamlandı",job.id)
})

worker1.on("failed",(job,error)=>{
    console.log("hata : ",job?.id,"->",error)
})
