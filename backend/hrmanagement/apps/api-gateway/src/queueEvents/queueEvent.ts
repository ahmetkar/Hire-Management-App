import {QueueEvents} from "bullmq"
import redis from "../config/redis"
import {Server} from "socket.io"


export async function startQueueEvents(io:Server){
    const queueEventsForJobApp = new QueueEvents("job-app-create",{connection:redis})

    queueEventsForJobApp.on("progress",async ({jobId,data})=>{
       
        const status = await redis.get(`jobapp-status:${jobId}`);

        if(status == "progress"){
             console.log("progress",jobId,data)
          io.to(`jobappQueue:${jobId}`).emit("job-progress",{jobId,data})
        }
    })

    queueEventsForJobApp.on("completed",async ({jobId,returnvalue})=>{
   
          const status = await redis.get(`jobapp-status:${jobId}`);

        if(status == "completed"){
                 console.log("completed",jobId,returnvalue)

        console.log(`queueEvents : jobappQueue:${jobId}`)
        console.log("Clients:", io.sockets.adapter.rooms.get(`jobappQueue:${jobId}`));

            io.to(`jobappQueue:${jobId}`).emit("job-completed",{jobId,result:returnvalue})
        }
   
        
    })

     queueEventsForJobApp.on("failed",async ({jobId,failedReason})=>{
       
        const status = await redis.get(`jobapp-status:${jobId}`);

        if(status == "failed"){
             console.log("failed",jobId,failedReason)
          io.to(`jobappQueue:${jobId}`).emit("job-failed",{jobId,error:failedReason})
        }
    })

    const queueEventsForStaff = new QueueEvents("staff-create",{connection:redis})

    queueEventsForStaff.on("progress",async ({jobId,data})=>{
       
        const status = await redis.get(`staffstatus:${jobId}`);
        if(status == "progress"){
             console.log("progress",jobId,data)
          io.to(`staffQueue:${jobId}`).emit("staff-progress",{jobId,data})
        }
    })

    queueEventsForStaff.on("completed",async ({jobId,returnvalue})=>{
       
        const status = await redis.get(`staffstatus:${jobId}`);
        if(status == "completed"){

             console.log("completed",jobId,returnvalue)
         io.to(`staffQueue:${jobId}`).emit("staff-completed",{jobId,result:returnvalue})
        }
   
        
    })

     queueEventsForStaff.on("failed",async ({jobId,failedReason})=>{
     
         const status = await redis.get(`staffstatus:${jobId}`);
        if(status == "failed"){
               console.log("failed",jobId,failedReason)
          io.to(`staffQueue:${jobId}`).emit("staff-failed",{jobId,error:failedReason})
        }
    })

    const queueEventsForSendPrompt = new QueueEvents("send-prompt",{connection:redis})

   

    queueEventsForSendPrompt.on("completed",async ({jobId,returnvalue})=>{
     
         const status = await redis.get(`sendpromptstatus:${jobId}`);
        if(status == "completed"){
               console.log("completed",jobId,returnvalue)
         io.to(`aiSendQueue:${jobId}`).emit("sendprompt-completed",{jobId,result:returnvalue})

        }
   
        
    })

    queueEventsForSendPrompt.on("progress",async ({jobId,data})=>{
      
         const status = await redis.get(`sendpromptstatus:${jobId}`);
        if(status == "progress"){
              console.log("progress",jobId,data) 
        io.to(`aiSendQueue:${jobId}`).emit("sendprompt-progress",{jobId,data})
        }
     })

     queueEventsForSendPrompt.on("failed",async ({jobId,failedReason})=>{
      
         const status = await redis.get(`sendpromptstatus:${jobId}`);
        if(status == "failed"){
              console.log("failed",jobId,failedReason) 

        io.to(`aiSendQueue:${jobId}`).emit("sendprompt-failed",{jobId,error:failedReason})
        }
        
    })



    const queueEventsForSavePrompt = new QueueEvents("save-prompt",{connection:redis})

   

    queueEventsForSavePrompt.on("completed",async ({jobId,returnvalue})=>{
        
        const status = await redis.get(`savepromptstatus:${jobId}`)
        if(status == "completed"){
            console.log("completed",jobId,returnvalue)
            io.to(`aiSaveQueue:${jobId}`).emit("saveprompt-completed",{jobId,result:returnvalue})
        }
   
        
    })

      queueEventsForSavePrompt.on("progress",async ({jobId,data})=>{
       
          const status = await redis.get(`savepromptstatus:${jobId}`)
        if(status == "progress"){
             console.log("progress",jobId,data) 
        io.to(`aiSaveQueue:${jobId}`).emit("saveprompt-progress",{jobId,data})
        }
        
    })

     queueEventsForSavePrompt.on("failed",async ({jobId,failedReason})=>{
      
          const status = await redis.get(`savepromptstatus:${jobId}`)
        if(status == "failed"){
              console.log("failed",jobId,failedReason)
        io.to(`aiSaveQueue:${jobId}`).emit("saveprompt-failed",{jobId,error:failedReason})
        }
        
    })


     const queueEventsForElasticSearch = new QueueEvents("elastic-search",{connection:redis})

   

    queueEventsForElasticSearch.on("completed",async ({jobId,returnvalue})=>{
       
        const status = await redis.get(`elasticstatus:${jobId}`)
        if(status == "completed"){
             console.log("completed",jobId,returnvalue)
            io.to(`elasticQueue:${jobId}`).emit("elastic-completed",{jobId,result:returnvalue})
        }
   
        
    })

    queueEventsForElasticSearch.on("progress",async ({jobId,data})=>{
   
        const status = await redis.get(`elasticstatus:${jobId}`)
        if(status == "progress"){
                 console.log("progress",jobId,data) 
        io.to(`elasticQueue:${jobId}`).emit("elastic-progress",{jobId,data})
        }
        
    })

     queueEventsForElasticSearch.on("failed",async ({jobId,failedReason})=>{
       
        const status = await redis.get(`elasticstatus:${jobId}`)
        if(status == "failed"){
             console.log("failed",jobId,failedReason) 
        io.to(`elasticQueue:${jobId}`).emit("elastic-failed",{jobId,error:failedReason})
        }
        
    })



}