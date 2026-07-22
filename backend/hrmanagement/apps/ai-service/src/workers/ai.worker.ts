import {Worker} from "bullmq"
import redis from "../configs/redis"
import {prisma}  from "@hrmanagement/prisma"


const worker1 = new Worker("send-prompt",async(job)=>{

  return;
},{connection:redis,concurrency:5})


const worker2 = new Worker("save-prompt",async(job)=>{

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