import {QueueEvents} from "bullmq"
import redis from "../config/redis"
import {Server} from "socket.io"


export async function startQueueEvents(io:Server){
    const queueEventsForJobApp = new QueueEvents("job-app-create",{connection:redis})

    queueEventsForJobApp.on("progress",async ({jobId,data})=>{
        console.log("progress",jobId,data)
        const status = await redis.get(`jobappstatus:${jobId}`)
        if(status == "progress"){
            io.to(`jobappQueue:${jobId}`).emit("job-progress",{jobId,data})
        }
    })

    queueEventsForJobApp.on("completed",async ({jobId,returnvalue})=>{
        console.log("completed",jobId,returnvalue)
        const status = await redis.get(`jobappstatus:${jobId}`)
        if(status == "completed"){
            io.to(`jobappQueue:${jobId}`).emit("job-completed",{jobId,result:returnvalue})
        }
   
        
    })

     queueEventsForJobApp.on("failed",async ({jobId,failedReason})=>{
        console.log("failed",jobId,failedReason)
         const status = await redis.get(`jobappstatus:${jobId}`)
        if(status == "failed"){
            io.to(`jobappQueue:${jobId}`).emit("job-failed",{jobId,error:failedReason})
        }
    })

    const queueEventsForStaff = new QueueEvents("staff-create",{connection:redis})

    queueEventsForStaff.on("progress",async ({jobId,data})=>{
        console.log("progress",jobId,data)
        const status = await redis.get(`staffstatus:${jobId}`)
        if(status == "progress"){
            io.to(`staffQueue:${jobId}`).emit("staff-progress",{jobId,data})
        }
    })

    queueEventsForStaff.on("completed",async ({jobId,returnvalue})=>{
        console.log("completed",jobId,returnvalue)
        const status = await redis.get(`staffstatus:${jobId}`)
        if(status == "completed"){
            io.to(`staffQueue:${jobId}`).emit("staff-completed",{jobId,result:returnvalue})
        }
   
        
    })

     queueEventsForStaff.on("failed",async ({jobId,failedReason})=>{
        console.log("failed",jobId,failedReason)
         const status = await redis.get(`staffstatus:${jobId}`)
        if(status == "failed"){
            io.to(`staffQueue:${jobId}`).emit("staff-failed",{jobId,error:failedReason})
        }
    })

    const queueEventsForSendPrompt = new QueueEvents("send-prompt",{connection:redis})

   

    queueEventsForSendPrompt.on("completed",async ({jobId,returnvalue})=>{
        console.log("completed",jobId,returnvalue)
        const status = await redis.get(`sendpromptstatus:${jobId}`)
        if(status == "completed"){
            io.to(`staffQueue:${jobId}`).emit("staff-completed",{jobId,result:returnvalue})
        }
   
        
    })

     queueEventsForSendPrompt.on("failed",async ({jobId,failedReason})=>{
        console.log("failed",jobId,failedReason) 
        io.to(`staffQueue:${jobId}`).emit("staff-failed",{jobId,error:failedReason})
        
    })



    const queueEventsForSavePrompt = new QueueEvents("save-prompt",{connection:redis})

   

    queueEventsForSavePrompt.on("completed",async ({jobId,returnvalue})=>{
        console.log("completed",jobId,returnvalue)
        const status = await redis.get(`savepromptstatus:${jobId}`)
        if(status == "completed"){
            io.to(`staffQueue:${jobId}`).emit("staff-completed",{jobId,result:returnvalue})
        }
   
        
    })

     queueEventsForSavePrompt.on("failed",async ({jobId,failedReason})=>{
        console.log("failed",jobId,failedReason)
        io.to(`staffQueue:${jobId}`).emit("staff-failed",{jobId,error:failedReason})
        
    })


     const queueEventsForElasticSearch = new QueueEvents("elastic-search",{connection:redis})

   

    queueEventsForElasticSearch.on("completed",async ({jobId,returnvalue})=>{
        console.log("completed",jobId,returnvalue)
        const status = await redis.get(`elasticstatus:${jobId}`)
        if(status == "completed"){
            io.to(`staffQueue:${jobId}`).emit("staff-completed",{jobId,result:returnvalue})
        }
   
        
    })

     queueEventsForElasticSearch.on("failed",async ({jobId,failedReason})=>{
        console.log("failed",jobId,failedReason) 
        io.to(`staffQueue:${jobId}`).emit("staff-failed",{jobId,error:failedReason})
        
    })



}