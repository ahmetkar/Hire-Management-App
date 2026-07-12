import {prisma}  from "@hrmanagement/prisma"
import { Prisma } from "@prisma/client";




export const SendJobMailToUser = async (email:string,name:string,jobId:string,jobAppId:string,status:string) => {

        if(status == "approved"){

        }else if(status == "denied"){
            
        }
        
}


export const SendJobNotificationToStaff = async (byWhoId:string,jobId:string,jobAppId:string,status:string) => {

        if(status == "created"){


            //created job app

        }
        

        let ids = []
       
         try {

            const staffs = await prisma.users.findMany({where:{role:"staff"}})
            if(!staffs){
                console.log("Staff not found")
                return;
            }

            ids = staffs.map((staff)=>{
                return staff.id
            })


            const datas : Prisma.notificationsCreateManyInput[] = ids.map((id)=>({
                    title:"",
                    desc:"",
                    bywhoId:byWhoId,
                    toWhoId:id, 
                    href:""
            }))

            const notifications = await prisma.notifications.createMany({
                                data:datas
                            })
    
    
            if(notifications){
                console.log("Notification sended to users",ids.toString())           
            }else {
               console.log("Notification cannot sended to user ")             
            }
                   
    
            }catch(error){
                   console.log("Notification cannot sended to user ",error)    
            }


}

export const SendJobNotificationToManager = async (byWhoId:string,jobId:string,jobAppId:string,status:string) => {


        if(status == "approved"){

            //approved by staff
            
        }else if(status == "denied"){

            //denied by staff
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


            const datas : Prisma.notificationsCreateManyInput[] = ids.map((id)=>({
                    title:"",
                    desc:"",
                    bywhoId:byWhoId,
                    toWhoId:id, 
                    href:""
            }))

            const notifications = await prisma.notifications.createMany({
                                data:datas
                            })
    
    
            if(notifications){
                console.log("Notification sended to users",ids.toString())           
            }else {
               console.log("Notification cannot sended to user ")             
            }
                   
    
            }catch(error){
                   console.log("Notification cannot sended to user ",error)    
            }


}