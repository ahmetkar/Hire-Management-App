import {Worker} from "bullmq"
import redis from "../configs/redis"
import {prisma}  from "@hrmanagement/prisma"

import { randomUUID } from "crypto"
import { CreateEmbedIndex, CreateIndex } from "../helpers/elastic.helpers"
import { invalidateCacheTagKeys } from "../helpers/redis.helpers"



function handleError(errormsg:string){
    throw new Error(errormsg)
}
   


const worker2 = new Worker("save-prompt",async(job)=>{
            switch(job.name){
                case "app-one-save":{

                       const data = job.data.data
                       console.log("SAVE BAŞLADI", job.id, data);
                       if(await CreateIndex()){
                            const prompt = await redis.get(`jobapp:${data.sendedId}:prompt`)
                            const embeddingRedis = await redis.get(`jobapp:${data.sendedId}:embedding`)

                            if(!prompt || !embeddingRedis){

                                await redis.set(`savepromptstatus:${job.id}`,"failed","EX",300)  
                                  return handleError("Redisten gelen veride sorun var.");

                            }
                            const embeddingObj = JSON.parse(embeddingRedis) as Record<string,unknown>
                            if(embeddingObj==null){

                                await redis.set(`savepromptstatus:${job.id}`,"failed","EX",300)  
                                return handleError("Redisten gelen veri işlenirken sorun oluştu.");
                            }
                            let embedding = null
                            
                            const embeddingArr = embeddingObj.data as Record<string,unknown>[]
                            embedding = embeddingArr[0].embedding
                            if(embedding == null){

                                await redis.set(`savepromptstatus:${job.id}`,"failed","EX",300)  
                                return handleError("Redisten gelen veri işlenirken sorun oluştu.");
                            }
                            
                            
                            //index oluştu devam et
                            const elasticId = randomUUID()
                    
                            const elasticResult = await CreateEmbedIndex({id:elasticId,sendedId:data.sendedId,kind:data.kind,embedding:embedding});
                    
                            if(!elasticResult){
                                //return res.status(501).json({message:"ElasticSearch a kaydetme başarısız oldu."})
                                await redis.set(`savepromptstatus:${job.id}`,"failed","EX",300)  
                                 return handleError("ElasticSearch a kaydetme başarısız oldu.");
                            }

                            const appInfo = await prisma.jobapplication.findUnique({where:{id:data.sendedId}})
                    
                            if(!appInfo){
                                //return res.status(404).json({message:"İş başvurusu bilgisi bulunamadı."})
                                await redis.set(`savepromptstatus:${job.id}`,"failed","EX",300)  
                                return handleError("İş başvurusu bilgisi bulunamadı.");
                            }
                    
                            const saveprompt = await prisma.aIPrompts.create({data:{kind:data.kind,applicationId:appInfo.id,promptText:prompt,responseText:data.result,elasticId:elasticId}})
                    
                                if(saveprompt){
                                invalidateCacheTagKeys(`cache-tag:jobapp:${appInfo.id}`)
                                await redis.set(`savepromptstatus:${job.id}`,"completed","EX",300)  
                                return {success:true,message:"Kaydetme başarılı."}
                                }else {
                                     await redis.set(`savepromptstatus:${job.id}`,"failed","EX",300)  
                                     return handleError("Kaydetme başarısız oldu.");
                                }
                       }else {
                            
                    await redis.set(`savepromptstatus:${job.id}`,"failed","EX",300)  
                    return handleError("Elastic Search index ekleme başarısız oldu.");

                       }

                }
                case "staff-one-save":
                    {
                      const data = job.data.data
                      
                       if(await CreateIndex()){
                            const prompt = await redis.get(`staff:${data.sendedId}:prompt`)
                            const embeddingRedis = await redis.get(`staff:${data.sendedId}:embedding`)

                            if(!prompt || !embeddingRedis){
                                await redis.set(`savepromptstatus:${job.id}`,"failed","EX",300)  
                                return handleError("Redisten gelen veride sorun var.");
                            }
                            const embeddingObj = JSON.parse(embeddingRedis) as Record<string,unknown>
                            if(embeddingObj==null){

                                await redis.set(`savepromptstatus:${job.id}`,"failed","EX",300)  
                                     return handleError("Redisten gelen veri işlenirken sorun oluştu.");
                            }
                            let embedding = null
                                    
                            const embeddingArr = embeddingObj.data as Record<string,unknown>[]
                            embedding = embeddingArr[0].embedding
                            if(embedding == null){
                                await redis.set(`savepromptstatus:${job.id}`,"failed","EX",300)  
                                    return handleError("Redisten gelen veri işlenirken sorun oluştu.");
                            }
        
                            //index oluştu devam et
                            const elasticId = randomUUID()
                    
                            const elasticResult = await CreateEmbedIndex({id:elasticId,sendedId:data.sendedId,kind:data.kind,embedding:embedding});
                    
                            if(!elasticResult){
                                //return res.status(501).json({message:"ElasticSearch a kaydetme başarısız oldu."})
                                await redis.set(`savepromptstatus:${job.id}`,"failed","EX",300)  
                                 return handleError("ElasticSearch a kaydetme başarısız oldu.");
         
                            }

                             const personInfo = await prisma.staff.findUnique({where:{id:data.sendedId}})
                    
                            if(!personInfo){
                                //return res.status(404).json({message:"Personel bilgisi bulunamadı."})
                                await redis.set(`savepromptstatus:${job.id}`,"failed","EX",300)  
                                return handleError("Personel bilgisi bulunamadı.");
                            }
                            const saveprompt = await prisma.aIPrompts.create({data:{kind:data.kind,staffId:personInfo.id,promptText:prompt,responseText:data.result,elasticId:elasticId}})
                              if(saveprompt){
                                invalidateCacheTagKeys(`cache-tag:staff:${personInfo.id}`)
                                await redis.set(`savepromptstatus:${job.id}`,"completed","EX",300)  
                                return {success:true,message:"Başarıyla kaydedildi.s"}
                                }else {
                                await redis.set(`savepromptstatus:${job.id}`,"failed","EX",300)  
                                return handleError("Prompt kaydedilirken sorun oluştu.");
                                }
                       }
                    else {
                            
                    await redis.set(`savepromptstatus:${job.id}`,"failed","EX",300)  
                    return handleError("Elastic Search index ekleme başarısız oldu.");

                    }
                    }
                case "app-multi-save":{
                 
                    const data = job.data.data
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
                    
                                const elasticResult = await CreateEmbedIndex({id:elasticId,sendedId:info.sendedId,kind:data.kind,embedding:embedding});
                    
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
                    
                                const saveprompt = await prisma.aIPrompts.create({data:{kind:data.kind,applicationId:appInfo.id,promptText:prompt,responseText:info.result,elasticId:elasticId}})
                    
                                    if(saveprompt){
                                        invalidateCacheTagKeys(`cache-tag:jobapp:${appInfo.id}`)
                                        resultcount+=1
                                    }
                    
                                count+=1
                            })
                                
                            if(data.infoList.length == resultcount && errorcount==0){
                                await redis.set(`savepromptstatus:${job.id}`,"completed","EX",300)  
                                 return {success:true,message:"Prompt başarıyla kaydedildi."};
                            }else {
                                await redis.set(`savepromptstatus:${job.id}`,"failed","EX",300)  
                                 return handleError(`Prompt kaydetme başarısız oldu.. : ${errorList.join(",")}`);
                             
                            }
                             
                    
                        }else {
                            
                            await redis.set(`savepromptstatus:${job.id}`,"failed","EX",300)  
                            return handleError("Elastic Search index ekleme başarısız oldu.");

                    }
                }
                case "staff-multi-save":
                {
                            let count = 0;
                            let resultcount = 0;
                            let errorcount = 0;
                            const errorList : string[] = []
                    const data = job.data.data
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
  
                                const elasticResult = await CreateEmbedIndex({id:elasticId,sendedId:info.sendedId,kind:data.kind,embedding:embedding});
                    
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
                                    const saveprompt = await prisma.aIPrompts.create({data:{kind:data.kind,staffId:personInfo.id,promptText:prompt,responseText:info.result,elasticId:elasticId}})
                                        if(saveprompt){
                                            invalidateCacheTagKeys(`cache-tag:staff:${personInfo.id}`)
                                            resultcount+=1
                                        }

                            count+=1
                            })
                                
                            if(data.infoList.length == resultcount && errorcount==0){
                                await redis.set(`savepromptstatus:${job.id}`,"completed","EX",300)  
                                return {success:true,message:"Prompt dizisi başarıyla kaydedildi.."};
                            }else {
                                await redis.set(`savepromptstatus:${job.id}`,"failed","EX",300)  
                                  return handleError(`Prompt kaydetme başarısız oldu.. : ${errorList.join(",")}`);
                            }
                    
                        }else {
                            
                                await redis.set(`savepromptstatus:${job.id}`,"failed","EX",300)  
                                return handleError("Elastic Search index ekleme başarısız oldu.");

                                }
                 
                }
            
    }

},{connection:redis,concurrency:10})


worker2.on("completed",(job)=>{
    console.log("tamamlandı",job.id)
})

worker2.on("failed",(job,error)=>{
    console.log("hata : ",job?.id,"->",error)
})