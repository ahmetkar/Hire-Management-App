import { Request,Response,NextFunction } from "express";
import {prisma}  from "@hrmanagement/prisma"
import {getEmbedding, PromptInput, sendPromptToAgent} from "../helpers/ai.helpers"




export const SaveAIPrompt = async (req:Request,res:Response,next:NextFunction) => {

    const role = req.headers["x-user-role"]

    if(role!="admin" && role!="staff"){
        return res.status(404).json({message:"Yetkilendirmede sorun var."})
     
    }

   // const {applicationId,aiprompt,embedding} = req.body

   
    return next();
}

export const SearchForOldestStaff = async (req:Request,res:Response,next:NextFunction) => {

     return next();

}

export const SearchForNewestStaff = async (req:Request,res:Response,next:NextFunction) => {

     return next();

}


export const SearchForSameInfos = async (req:Request,res:Response,next:NextFunction) => {

     return next();

}

export const SendAIPrompt = async (req:Request,res:Response,next:NextFunction) => {


    const role = req.headers["x-user-role"]

    if(role!="admin" && role!="staff"){
        return res.status(404).json({message:"Yetkilendirmede sorun var."})
     
    }

    const {applicationId
    } = req.body

    const appInfo = await prisma.jobapplication.findUnique({where:{id:applicationId}})

    if(!appInfo){
        return res.status(404).json({message:"İş başvurusu bilgisi bulunamadı."})
    }

    if(!appInfo.jobId || !appInfo.university || !appInfo.abilities || !appInfo.unidepartment || !appInfo.address ||
        !appInfo.graduatedate || !appInfo.selfbio || !appInfo.county || !appInfo.city
    ){

        return res.status(404).json({message:"İş başvurusu bilgisi bulunamadı."})
    }

    const jobInfo = await prisma.jobs.findUnique({where:{id:appInfo.jobId}})

    if(!jobInfo) {
        return res.status(404).json({message:"İş başvurusu yapan kullanıcı için iş bilgisi bulunamadı."})
    }

    const promptInput : PromptInput = {
        role:role,name:appInfo.name,university:appInfo.university,unidepartment:appInfo.unidepartment
            ,graduatedate:appInfo.graduatedate.toISOString(),abilities:appInfo.abilities,address:appInfo.address,birthdate:appInfo.birthdate.toISOString()
            ,selfbio:appInfo.selfbio,city:appInfo.city,county:appInfo.county,jobtitle:jobInfo.jobtitle,jobrequirements:jobInfo.jobrequirements
    }
    const response = await sendPromptToAgent(promptInput);

    const messageOutput = response.outputs.find(output=>output.type == "message.output")

    if (!messageOutput || !("content" in messageOutput)) {
         return res.status(404).json({message:"AI agentten gelen response da sorun var."})
    }

    const responseText =
        typeof messageOutput.content === "string"
            ? messageOutput.content
            : messageOutput.content
                .filter(chunk => chunk.type === "text")
                .map(chunk => ("text" in chunk ? chunk.text : ""))
                .join("");
                
    const embeddingResponse = await getEmbedding(responseText)

     if(response){
        return res.status(201).json({airesponse:responseText,embedding:embeddingResponse})
     }else {
        return res.status(404).json({message:"Response içeriği alma başarısız",airesponse:responseText,embedding:embeddingResponse})
     }
     

}






export const SendMultipileAIPrompt = async (req:Request,res:Response,next:NextFunction) => {

     const role = req.headers["x-user-role"]


     if(role!="admin" && role!="staff"){
        return res.status(404).json({message:"Yetkilendirmede sorun var."})
     }

    const {applicationIdList} = req.body
    
    

    if(!applicationIdList){
        return res.status(404).json({message:"İş başvurusu yapan kullanıcı verilen bilgilerin formatı yanlış."})
    }
    
    
    let resultdict  = {}
    let resultcount = 0
  
    applicationIdList.forEach( async (applicationId : string)=>{
          
         const appInfo = await prisma.jobapplication.findUnique({where:{id:applicationId}})

        if(!appInfo){

            resultdict = {...resultdict,applicationId:[null,null]}
            return;
        }

        if(!appInfo.jobId || !appInfo.university || !appInfo.abilities || !appInfo.unidepartment || !appInfo.address ||
            !appInfo.graduatedate || !appInfo.selfbio || !appInfo.county || !appInfo.city
        ){
            resultdict = {...resultdict,applicationId:[null,null]}
            return;
        }

        const jobInfo = await prisma.jobs.findUnique({where:{id:appInfo.jobId}})

        if(!jobInfo) {
            resultdict = {...resultdict,applicationId:[null,null]}
            return;
        }

       const promptInput : PromptInput = {
        role:role,name:appInfo.name,university:appInfo.university,unidepartment:appInfo.unidepartment
            ,graduatedate:appInfo.graduatedate.toISOString(),abilities:appInfo.abilities,address:appInfo.address,birthdate:appInfo.birthdate.toISOString()
            ,selfbio:appInfo.selfbio,city:appInfo.city,county:appInfo.county,jobtitle:jobInfo.jobtitle,jobrequirements:jobInfo.jobrequirements
        }
        const response = await sendPromptToAgent(promptInput);

        const messageOutput = response.outputs.find(output=>output.type == "message.output")

        if (!messageOutput || !("content" in messageOutput)) {
            resultdict = {...resultdict,applicationId:[null,null]}
            return;
        }

        const responseText =
            typeof messageOutput.content === "string"
                ? messageOutput.content
                : messageOutput.content
                    .filter(chunk => chunk.type === "text")
                    .map(chunk => ("text" in chunk ? chunk.text : ""))
                    .join("");
                    
       

        if(responseText!=""){
             const embeddingResponse = await getEmbedding(responseText)
             resultcount+=1
             resultdict = {...resultdict,applicationId:[responseText,embeddingResponse]}
        }else {
            resultdict = {...resultdict,applicationId:[null,null]}
        }
    })
    
    if(resultcount==0){
        return res.status(404).json({result:resultdict});
    }

    return res.status(201).json({result:resultdict});
}


