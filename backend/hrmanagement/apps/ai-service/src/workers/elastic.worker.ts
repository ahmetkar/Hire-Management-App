import {Worker} from "bullmq"
import redis from "../configs/redis"


const worker = new Worker("elastic-search",async(job)=>{
    
    return;
},{connection:redis,concurrency:5})


worker.on("completed",(job)=>{
    console.log("tamamlandı",job.id)
})

worker.on("failed",(job,error)=>{
    console.log("hata : ",job?.id,"->",error)
})