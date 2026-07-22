import { Request,Response,NextFunction } from "express";
import {prisma}  from "@hrmanagement/prisma"
import { CreateEmbedIndex, CreateIndex, GetEmbedIndex, SearchEmbedIndex } from "../helpers/elastic.helpers";

import { aiPromptQueue } from "../queue/aiprompt.queue";


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

       const aiJob = await aiPromptQueue.add("app-multi-save",{data:data})

       if(aiJob.id){
              res.status(201).json({
                            status:"waiting",
                            id:aiJob.id                        
                        });
       }else {
            return res.status(404).json({message:"Job app Ai  multi save isteği kuyruğa eklenemedi."})
       }

    }else if(kind == "staff") {
      
        const aiJob = await aiPromptQueue.add("staff-multi-save",{data:data})

       if(aiJob.id){
              res.status(201).json({
                            status:"waiting",
                            id:aiJob.id                        
                        });
       }else {
            return res.status(404).json({message:"Staff Ai  multi save isteği kuyruğa eklenemedi."})
       }
      

    }

    return res.status(404).json({message:"Parametrelerde hata var."});
   

}



export const SaveAIPrompt = async (req:Request,res:Response,next:NextFunction) => {

    const role = req.headers["x-user-role"]

    if(role!="admin" && role!="staff"){
        return res.status(404).json({message:"Yetkilendirmede sorun var."})
     
    }

   const {kind,sendedId,result} = req.body

   
   const data = {sendedId:sendedId,result:result,kind:kind}

       if(kind == "application"){

       const aiJob = await aiPromptQueue.add("app-one-save",{data:data})

       if(aiJob.id){
              res.status(201).json({
                            status:"waiting",
                            id:aiJob.id                        
                        });
       }else {
            return res.status(404).json({message:"Job app Ai save isteği kuyruğa eklenemedi."})
       }

    }else if(kind == "staff") {
      
        const aiJob = await aiPromptQueue.add("staff-one-save",{data:data})

       if(aiJob.id){
              res.status(201).json({
                            status:"waiting",
                            id:aiJob.id                        
                        });
       }else {
            return res.status(404).json({message:"Staff Ai save isteği kuyruğa eklenemedi."})
       }
      

    }

    return res.status(404).json({message:"Parametrelerde hata var."});

   
}

export const SearchForOldestStaff = async (req:Request,res:Response,next:NextFunction) => {

    const role = req.headers["x-user-role"]

    if(role!="admin" && role!="staff"){
        return res.status(404).json({message:"Yetkilendirmede sorun var."})
     
    }

    const {applicationId} = req.body

    const appInfo = await prisma.jobapplication.findUnique({where:{id:applicationId},include:{appPrompts:true}})

    if(!appInfo){
        return res.status(404).json({message:"İş başvurusu bilgisi bulunamadı."})
    }
    if(appInfo.jobId==null){
        return res.status(404).json({message:"İş başvurusu iş bilgilerinde sorun var."})
    }

    if(appInfo.appPrompts == null){
        return res.status(404).json({message:"Personel için prompt bilgisi yok."})
    }

    const jobInfo = await prisma.jobs.findUnique({where:{id:appInfo.jobId}})

    if(!jobInfo){
        return res.status(404).json({message:"İş başvurusundaki iş bilgisi bulunamadı."})
    }

    const foundOldest = await prisma.staff.findMany({where:{jobId:appInfo.jobId,staffPrompts:{
        some:{}
    }},orderBy:{signupdate:"asc"},take:10,include:{staffPrompts:true}})

    if(!foundOldest){
        return res.status(404).json({message:"Personel bilgileri bulunamadı."})
    }


    //En sonuncu promptu al
    const embedIndexIdList = await Promise.all(foundOldest.map(async (s)=>{
        const getPrompt = s.staffPrompts.at(-1)
        if(getPrompt != undefined){
         if(await GetEmbedIndex(getPrompt.elasticId)==null){
            return null
         }else {
            return getPrompt.elasticId
         }
        }else {
            return null
        }
    }
    ))

    if(embedIndexIdList.every(item=>item == null)){
        return res.status(404).json({message:"Personeller için Elastic Search kayıtları bulunamadı."})
    }
     const embedIndexIdListNotNull = embedIndexIdList.filter((el)=>el!=null)

    console.log(appInfo.appPrompts)
    const getAppPrompt = appInfo.appPrompts.at(-1)
    
    
    if(getAppPrompt==undefined){
        return res.status(404).json({message:"Application için prompt kaydı yok."})
    }
    console.log(getAppPrompt)
    const appEmbeddingGet = await GetEmbedIndex(getAppPrompt.elasticId)
    console.log(appEmbeddingGet)
    const appEmbedding = appEmbeddingGet!=null ? appEmbeddingGet.embedding : null

    if(appEmbedding==null){
        return res.status(404).json({message:"Application için elastic search kaydı yok."})
    }

   
    const search = await SearchEmbedIndex(appEmbedding,embedIndexIdListNotNull);

    if(search){
        return res.status(201).json({message:"Arama başarıyla sonuçlandı",results:search})
    }else {
        return res.status(404).json({message:"Arama başarısız."})
    }


}

export const SearchForNewestStaff = async (req:Request,res:Response,next:NextFunction) => {

     
    const role = req.headers["x-user-role"]

    if(role!="admin" && role!="staff"){
        return res.status(404).json({message:"Yetkilendirmede sorun var."})
     
    }

    const {applicationId} = req.body

    const appInfo = await prisma.jobapplication.findUnique({where:{id:applicationId},include:{appPrompts:true}})

    if(!appInfo){
        return res.status(404).json({message:"İş başvurusu bilgisi bulunamadı."})
    }
    if(appInfo.jobId==null){
        return res.status(404).json({message:"İş başvurusu iş bilgilerinde sorun var."})
    }

    if(appInfo.appPrompts == null){
        return res.status(404).json({message:"Personel için prompt bilgisi yok."})
    }
    const jobInfo = await prisma.jobs.findUnique({where:{id:appInfo.jobId}})

    if(!jobInfo){
        return res.status(404).json({message:"İş başvurusundaki iş bilgisi bulunamadı."})
    }

    const foundNewest = await prisma.staff.findMany({where:{jobId:appInfo.jobId,staffPrompts:{
        some:{}
    }},orderBy:{signupdate:"desc"},take:10,include:{staffPrompts:true}})

    if(!foundNewest){
        return res.status(404).json({message:"Personel bilgileri bulunamadı."})
    }
    
    //En sonuncu promptu al
    const embedIndexIdList = await Promise.all(foundNewest.map((s)=>{
        const getPrompt = s.staffPrompts.at(-1)
        if(getPrompt != undefined){
         if(GetEmbedIndex(getPrompt.elasticId)==null){
            return null
         }else {
            return getPrompt.elasticId
         }
        }else {
            return null
        }
    }
    ))

    if(embedIndexIdList.every(item=>item == null)){
        return res.status(404).json({message:"Personeller için Elastic Search kayıtları bulunamadı."})
    }
     const embedIndexIdListNotNull = embedIndexIdList.filter((el)=>el!=null)

    const getAppPrompt = appInfo.appPrompts.at(-1)
    
    if(getAppPrompt==undefined){
        return res.status(404).json({message:"Application için prompt kaydı yok."})
    }
    const appEmbeddingGet = await GetEmbedIndex(getAppPrompt.elasticId)
    const appEmbedding = appEmbeddingGet!=null ? appEmbeddingGet.embedding : null

    if(appEmbedding==null){
        return res.status(404).json({message:"Application için elastic search kaydı yok."})
    }

   
    const search = await SearchEmbedIndex(appEmbedding,embedIndexIdListNotNull);

    if(search){
        return res.status(201).json({message:"Arama başarıyla sonuçlandı",results:search})
    }else {
        return res.status(404).json({message:"Arama başarısız."})
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
      

    }

    return res.status(404).json({message:"Parametrelerde hata var."});


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
      

    }

    return res.status(404).json({message:"Parametrelerde hata var."});
   
   
}


