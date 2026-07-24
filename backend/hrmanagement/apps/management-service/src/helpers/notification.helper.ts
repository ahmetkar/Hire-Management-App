import {prisma}  from "@hrmanagement/prisma"
import { managementStaffQueue } from "../queue/managementstaff.queue";
import { managementManagerQueue } from "../queue/managementmanager.queue";



export const SendJobMailToUser = async (email:string,name:string,jobId:string,jobAppId:string,status:string) => {

        if(status == "approved"){

         
            
        }else if(status == "denied"){
            
        }
        
}


export const SendJobNotificationToStaff = async (byWhoId:string,jobId:string,jobAppId:string,status:string) => {
        const date = new Date()


        let title="";
        let desc="";
        let href="";
        const jobapp = await prisma.jobapplication.findUnique({where:{id:jobAppId}})
        const job = await prisma.jobs.findUnique({where:{id:jobId}})

        if(jobapp && job){

            if(status == "created"){
            //byWhoId önemsiz çünkü job application created
            title = `${job.jobtitle} ilanına yeni bir iş başvurusu yapıldı.`
            desc = `${jobapp.name} tarafından yeni bir iş başvurusu ${jobapp.appdate.toString().split("T")[0]} tarihinde yapıldı.`
            href = jobapp.id
           

            let ids = []
       
         try {

            const staffs = await prisma.users.findMany({where:{role:"staff"}})
            if(staffs.length === 0){
                console.log("Staff not found")
                return;
            }
            ids = staffs.map((staff)=>{
                return staff.id
            })
            
            const data = {ids:ids,byWhoId:byWhoId,title:title,desc:desc,href:href,date:date}
            const managementJob = await managementStaffQueue.add("send-notification-staff",{data:data})

              if(managementJob.id){
                console.log("staff notification job",managementJob.id," kuyruğa eklendi.")
                }else {
                    console.log("işlem kuyruğa eklenemedi")
                }
                   
            }catch(error){
                   console.log("Notification cannot sended to user ",error)    
            }


            }else {
                console.log("Notification Status not valid")
            }

        }else {
                 console.log("Notification cannot sended to user ")  
            }
   
}

export const SendJobNotificationToManager = async (byWhoId:string,jobId:string,jobAppId:string,status:string) => {

        const date = new Date()
        let title="";
        let desc="";
        let href="";
        const jobapp = await prisma.jobapplication.findUnique({where:{id:jobAppId}})
        const job = await prisma.jobs.findUnique({where:{id:jobId}})


        if(jobapp && job){


            if(status == "approved"){
            const by = await prisma.users.findUnique({where:{id:byWhoId}}) 
            if(by){
                title = `${by.name} tarafından #${jobapp.id} id li iş ilanı sizin onayınıza gönderildi.`
                desc = `${job.jobtitle} başlıklı iş ilanına gelen ${jobapp.appdate} tarihli #${jobapp.id} id li iş başvurusu
                ${by.name} tarafından size gönderildi ve sizden onay bekliyor`
                href = jobapp.id
            }   
                
            }else if(status == "denied"){
            const by = await prisma.users.findUnique({where:{id:byWhoId}})    

            if(by){
                title = `${by.name} tarafından #${jobapp.id} id li iş ilanı reddedildi.`
                desc = `${job.jobtitle} başlıklı iş ilanına gelen ${jobapp.appdate} tarihli #${jobapp.id} id li iş ilanı ${by.name} tarafından reddedildi.`
                href = jobapp.id
            }   

            }else if(status == "created"){
                title = `${job.jobtitle} ilanına yeni bir iş başvurusu yapıldı.`
                desc = `${jobapp.name} tarafından yeni bir iş başvurusu ${jobapp.appdate.toString().split("T")[0]} tarihinde yapıldı.`
                href = jobapp.id
            
            }else {
                console.log("Notification status not valid")
                return;
            }
            

        let ids = []
       
         try {

            const admins = await prisma.users.findMany({where:{role:"admin"}})
            if(!admins){
                console.log("Admin not found")
                return;
            }

            ids = admins.map((admin)=>{
                return admin.id
            })



            const data = {ids:ids,byWhoId:byWhoId,title:title,desc:desc,href:href,date:date}
            const managementJob = await managementManagerQueue.add("send-notification-manager",{data:data})

              if(managementJob.id){
                console.log("management notification job ",managementJob.id," kuyruğa eklendi.")
                }else {
                    console.log("işlem kuyruğa eklenemedi")
                }
                   
                   
    
            }catch(error){
                   console.log("Notification cannot sended to user ",error)    
            }

     }
}