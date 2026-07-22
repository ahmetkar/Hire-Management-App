
import {Worker} from "bullmq"
import redis from "../configs/redis"
import {prisma}  from "@hrmanagement/prisma"
import { invalidateCacheTagKeys } from "../helpers/redis.helpers"
import { Prisma } from "@prisma/client"


const worker1 = new Worker("send-notification-staff",async(job)=>{
    const data = job.data;
    let datas : Prisma.notificationsCreateManyInput[] = []

            if(data.byWhoId!=""){
                    datas = data.ids.map((id:string)=>{
                            return  {
                                
                                title:data.title,
                                desc:data.desc,
                                bywhoId:data.byWhoId,
                                toWhoId:id, 
                                href:data.href,
                                date:data.date
                            }
                     
                    })
                   
            }else {
                    datas = data.ids.map( (id:string)=>{
                            return {
                                
                                title:data.title,
                                desc:data.desc,
                                toWhoId:id, 
                                href:data.href,
                                date:data.date
                            }
                     
                    })
            }

            const add = await prisma.notifications.createMany({
                                data:datas
            })

        
            if(add){
                data.ids.forEach((id:string)=>{
                    invalidateCacheTagKeys(`cache-tag:notifications:${id}`)
                })
               
                console.log("Notification sended to users",data.ids.toString())  
                 return {success:true}         
            }else {
               throw new Error("Bildirim işlemlerinde sorun oluştu")     
            }
},{connection:redis,concurrency:5})

const worker2 = new Worker("send-notification-manager",async(job)=>{
    
            const data = job.data;
            let datas : Prisma.notificationsCreateManyInput[] = []

            if(data.byWhoId!=""){
                    datas = data.ids.map((id:string)=>{
                            return  {
                                
                                 title:data.title,
                                desc:data.desc,
                                bywhoId:data.byWhoId,
                                toWhoId:id, 
                                href:data.href,
                                date:data.date
                            }
                     
                    })
                   
            }else {
                    datas = data.ids.map( (id:string)=>{
                            return {
                                
                                  title:data.title,
                                desc:data.desc,
                                toWhoId:id, 
                                href:data.href,
                                date:data.date
                            }
                     
                    })
            }


            const add = await prisma.notifications.createMany({
                                data:datas
            })

    
            if(add){
                 data.ids.forEach((id:string)=>{
                    invalidateCacheTagKeys(`cache-tag:notifications:${id}`)
                })
                console.log("Notification sended to users",data.ids.toString())           
            }else {
               throw new Error("Bildirim işlemlerinde sorun oluştu")               
            }

},{connection:redis,concurrency:5})


worker1.on("completed",(job)=>{
    console.log("staff notification tamamlandı",job.id)
})

worker1.on("failed",(job,error)=>{
    console.log("staff hata : ",job?.id,"->",error)
})


worker2.on("completed",(job)=>{
    console.log("manager notification tamamlandı",job.id)
})

worker2.on("failed",(job,error)=>{
    console.log("manager hata : ",job?.id,"->",error)
})