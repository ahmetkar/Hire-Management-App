import {Worker} from "bullmq"
import redis from "../configs/redis"
import {prisma}  from "@hrmanagement/prisma"
import { publishJobAppCreated } from "../events/producers/jobAppCreated.producers"
import { invalidateCacheTagKeys } from "../helpers/redis.helper"

enum JobAppStatus {
    NEW="new",
    WAITING="waiting",
    APPROVED="approved",
    DISAPPROVED="disapproved"
}

const worker = new Worker("job-app-create",async(job)=>{

    console.log("Worker başladı",job.id)

    await job.updateProgress({progress:true})

    const data = job.data

    const jobapp = await prisma.jobapplication.create({
                        data:data.data
    })
    
    if(jobapp){
        await job.updateProgress({progress:true})
        await redis.set(`jobappstatus:${job.id}`,"progress","EX",300)  
        invalidateCacheTagKeys(`cache-tag:jobapp:${JobAppStatus.NEW}`)
        publishJobAppCreated({
                            key:job.id!,jobAppId:data.id,name:data.name,email:data.email,jobId:data.jobId,ipaddress:data.ipadress===undefined ? "" : data.ipadress,message:"Application created"
                            })
        
        await redis.set(`jobappstatus:${job.id}`,"completed","EX",300)  
        return {success:true}
    }
     await redis.set(`jobappstatus:${job.id}`,"failed","EX",300)  
     throw new Error("Job application ekleme başarıssız oldu")
},{connection:redis,concurrency:5})


worker.on("completed",(job)=>{
    console.log("tamamlandı",job.id)
})

worker.on("failed",(job,error)=>{
    console.log("hata : ",job?.id,"->",error)
})