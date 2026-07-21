import {QueueEvents} from "bullmq"
import redis from "../config/redis"
import {Server} from "socket.io"


export async function startQueueEvents(io:Server){
    const queueEvents = new QueueEvents("job-app-create",{connection:redis})

    queueEvents.on("progress",async ({jobId,data})=>{
        console.log("progress",jobId,data)
        const status = await redis.get(`jobappstatus:${jobId}`)
        if(status == "progress"){
            io.to(jobId).emit("job-progress",{jobId,data})
        }
    })

    queueEvents.on("completed",async ({jobId,returnvalue})=>{
        console.log("completed",jobId,returnvalue)
        const status = await redis.get(`jobappstatus:${jobId}`)
        if(status == "completed"){
            io.to(jobId).emit("job-completed",{jobId,result:returnvalue})
        }
   
        
    })

     queueEvents.on("failed",async ({jobId,failedReason})=>{
        console.log("failed",jobId,failedReason)
         const status = await redis.get(`jobappstatus:${jobId}`)
        if(status == "failed"){
            io.to(jobId).emit("job-failed",{jobId,error:failedReason})
        }
    })
}