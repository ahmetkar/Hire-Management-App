import { Request,Response,NextFunction } from "express";
import { aiPromptQueue } from "../queue/aiprompt.queue";
import { elasticSearchQueue } from "../queue/elasticsearch.queue";
import { aiSaveQueue } from "../queue/aisave.queue";


export const SaveMultipileAIPrompt = async (req:Request,res:Response,next:NextFunction) => {


     const role = req.headers["x-user-role"]

    if(role!="admin" && role!="staff"){
        return res.status(404).json({message:"Yetkilendirmede sorun var."})
     
    }

   const {kind,infoList} = req.body
    //sendedId,prompt,result,embedding
    if(!kind || !infoList){
        return res.status(404).json({message:"Verilen bilgilerde sorun var."})
    }

    const data = {kind:kind,infoList:infoList}

    
    if(kind == "application"){

       const aiJob = await aiSaveQueue.add("app-multi-save",{data:data})

       if(aiJob.id){
              res.status(201).json({
                            status:"waiting",
                            id:aiJob.id                        
                        });
       }else {
            return res.status(404).json({message:"Job app Ai  multi save isteği kuyruğa eklenemedi."})
       }

    }else if(kind == "staff") {
      
        const aiJob = await aiSaveQueue.add("staff-multi-save",{data:data})

       if(aiJob.id){
              res.status(201).json({
                            status:"waiting",
                            id:aiJob.id                        
                        });
       }else {
            return res.status(404).json({message:"Staff Ai  multi save isteği kuyruğa eklenemedi."})
       }
      

    }else {

    return res.status(404).json({message:"Parametrelerde hata var."});
    }
   

}



export const SaveAIPrompt = async (req:Request,res:Response,next:NextFunction) => {

    const role = req.headers["x-user-role"]

    if(role!="admin" && role!="staff"){
        return res.status(404).json({message:"Yetkilendirmede sorun var."})
     
    }

   const {kind,sendedId,result} = req.body

   
   const data = {sendedId:sendedId,result:result,kind:kind}

       if(kind == "application"){

       const aiJob = await aiSaveQueue.add("app-one-save",{data:data})

       if(aiJob.id){
              res.status(201).json({
                            status:"waiting",
                            id:aiJob.id                        
                        });
       }else {
            return res.status(404).json({message:"Job app Ai save isteği kuyruğa eklenemedi."})
       }

    }else if(kind == "staff") {
      
        const aiJob = await aiSaveQueue.add("staff-one-save",{data:data})

       if(aiJob.id){
              res.status(201).json({
                            status:"waiting",
                            id:aiJob.id                        
                        });
       }else {
            return res.status(404).json({message:"Staff Ai save isteği kuyruğa eklenemedi."})
       }
      

    }else {

    return res.status(404).json({message:"Parametrelerde hata var."});
    }

   
}

export const SearchForOldestStaff = async (req:Request,res:Response,next:NextFunction) => {

    const role = req.headers["x-user-role"]

    if(role!="admin" && role!="staff"){
        return res.status(404).json({message:"Yetkilendirmede sorun var."})
     
    }

    const {applicationId} = req.body


    const data = {applicationId:applicationId}

   
    const elasticJob = await elasticSearchQueue.add("oldest-search",{data:data})

       
    if(elasticJob.id){
              res.status(201).json({
                            status:"waiting",
                            id:elasticJob.id                        
                        });
       }else {
            return res.status(404).json({message:"Elastic oldeststaff search isteği kuyruğa eklenemedi."})
       }


}

export const SearchForNewestStaff = async (req:Request,res:Response,next:NextFunction) => {

     
    const role = req.headers["x-user-role"]

    if(role!="admin" && role!="staff"){
        return res.status(404).json({message:"Yetkilendirmede sorun var."})
     
    }

    const {applicationId} = req.body

    const data = {applicationId:applicationId}

   
       const elasticJob = await elasticSearchQueue.add("newest-search",{data:data})

       
        if(elasticJob.id){
              res.status(201).json({
                        status:"waiting",
                        id:elasticJob.id                        
                });
       }else {
            return res.status(404).json({message:"Elastic newest staff search isteği kuyruğa eklenemedi."})
       }


}


export const SendAIPrompt = async (req:Request,res:Response,next:NextFunction) => {


    const role = req.headers["x-user-role"]

    if(role!="admin" && role!="staff"){
        return res.status(404).json({message:"Yetkilendirmede sorun var."})
     
    }

    const {kind,id} = req.body

    if(!id || !kind){
        return res.status(404).json({message:"İd ve kind bilgisi alınmadı."})
    }

    const data = {id:id,role:role};

    if(kind == "application"){

       const aiJob = await aiPromptQueue.add("app-one-prompt",{data:data})

       if(aiJob.id){
              res.status(201).json({
                            status:"waiting",
                            id:aiJob.id                        
                        });
       }else {
            return res.status(404).json({message:"Job app Ai prompt isteği kuyruğa eklenemedi."})
       }

    }else if(kind == "staff") {
      
        const aiJob = await aiPromptQueue.add("staff-one-prompt",{data:data})

       if(aiJob.id){
              res.status(201).json({
                            status:"waiting",
                            id:aiJob.id                        
                        });
       }else {
            return res.status(404).json({message:"Staff Ai prompt isteği kuyruğa eklenemedi."})
       }
      

    }else {
        return res.status(404).json({message:"Parametrelerde hata var."});
    }

    


}




export const SendMultipileAIPrompt = async (req:Request,res:Response,next:NextFunction) => {

     const role = req.headers["x-user-role"]


     if(role!="admin" && role!="staff"){
        return res.status(404).json({message:"Yetkilendirmede sorun var."})
     }

    const {kind,idList} = req.body
    
    
    if(!idList || !kind){
        return res.status(404).json({message:"İş başvurusu veya personel için verilen bilgilerin formatı yanlış."})
    }
    
    const data = {idList:idList,role:role}

    if(kind == "application"){

       const aiJob = await aiPromptQueue.add("app-multi-prompt",{data:data})

       if(aiJob.id){
              res.status(201).json({
                            status:"waiting",
                            id:aiJob.id                        
                        });
       }else {
            return res.status(404).json({message:"Job app Ai prompt multi isteği kuyruğa eklenemedi."})
       }

    }else if(kind == "staff") {
      
        const aiJob = await aiPromptQueue.add("staff-multi-prompt",{data:data})

       if(aiJob.id){
              res.status(201).json({
                            status:"waiting",
                            id:aiJob.id                        
                        });
       }else {
            return res.status(404).json({message:"Staff Ai multi prompt isteği kuyruğa eklenemedi."})
       }
      

    }else {

    return res.status(404).json({message:"Parametrelerde hata var."});
    }
   
   
}


