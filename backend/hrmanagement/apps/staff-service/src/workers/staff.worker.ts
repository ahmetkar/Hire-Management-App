import {Worker} from "bullmq"
import redis from "../configs/redis"
import {prisma}  from "@hrmanagement/prisma"

import { invalidateCacheTagKeys } from "../helpers/redis.helper"



const worker = new Worker("staff-create",async(job)=>{


const data = job.data


     await job.updateProgress({progress:true})
    await redis.set(`staffstatus:${job.id}`,"progress","EX",300)  

const staff = await prisma.staff.create({data:{
                                    ...data
                    }
                })

                     if(staff){
                        await redis.set(`staffstatus:${job.id}`,"completed","EX",300)  

                        invalidateCacheTagKeys("cache-tag:staff")
                        return {success:true}
                    }else {
                        await redis.set(`staffstatus:${job.id}`,"failed","EX",300) 
                        throw new Error("Personel ekleme başarısız oldu.")
                    }
    
},{connection:redis,concurrency:5})


worker.on("completed",(job)=>{
    console.log("tamamlandı",job.id)
})

worker.on("failed",(job,error)=>{
    console.log("hata : ",job?.id,"->",error)
})