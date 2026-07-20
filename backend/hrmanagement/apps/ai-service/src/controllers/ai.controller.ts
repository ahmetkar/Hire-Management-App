import { Request,Response,NextFunction } from "express";
import {prisma}  from "@hrmanagement/prisma"
import {generatePrompt,getEmbedding, PromptInput, sendPromptToAgent} from "../helpers/ai.helpers"
import { CreateEmbedIndex, CreateIndex, GetEmbedIndex, SearchEmbedIndex } from "../helpers/elastic.helpers";
import { randomUUID } from "crypto";


export const SaveMultipileAIPrompt = async (req:Request,res:Response,next:NextFunction) => {


    let success = false

     const role = req.headers["x-user-role"]

    if(role!="admin" && role!="staff"){
        return res.status(404).json({message:"Yetkilendirmede sorun var."})
     
    }

   const {kind,infoList} = req.body
    //sendedId,prompt,result,embedding
    if(!kind || !infoList){
        return res.status(404).json({message:"Verilen bilgilerde sorun var."})
    }

    if(await CreateIndex()){
        
        let successList = {}

        infoList.map(async (info : any)=>{
            const elasticId = randomUUID()

            const elasticResult = await CreateEmbedIndex({id:elasticId,sendedId:info.sendedId,kind:kind,embedding:info.embedding});

            if(!elasticResult){
                //return res.status(501).json({message:"ElasticSearch a kaydetme başarısız oldu."})
                successList = {...successList,[info.sendedId]:"elasticfault"}
                return;
            }
            
            if(kind == "application"){
            const appInfo = await prisma.jobapplication.findUnique({where:{id:info.sendedId}})

            if(!appInfo){
                //return res.status(404).json({message:"İş başvurusu bilgisi bulunamadı."})

                successList = {...successList,[info.sendedId]:"jobappfault"}

                return;
            }

            const saveprompt = await prisma.aIPrompts.create({data:{kind:kind,applicationId:appInfo.id,promptText:info.prompt,responseText:info.result,elasticId:elasticId}})

                if(saveprompt){
                   successList = {...successList,[info.sendedId]:"added"}
                }else {
                   successList = {...successList,[info.sendedId]:"notadded"}
                }


            }else if(kind == "staff"){
                const personInfo = await prisma.staff.findUnique({where:{id:info.sendedId}})

                if(!personInfo){
                    //return res.status(404).json({message:"Personel bilgisi bulunamadı."})

                    successList = {...successList,[info.sendedId]:"stafffault"}
                    return;
                }
                const saveprompt = await prisma.aIPrompts.create({data:{kind:kind,staffId:personInfo.id,promptText:info.prompt,responseText:info.result,elasticId:elasticId}})
                    if(saveprompt){
                    successList = {...successList,[info.sendedId]:"added"}
                    }else {
                       successList = {...successList,[info.sendedId]:"notadded"}
                    }
            }
        })
            
        const errors = ["notadded","stafffault","jobappfault","elasticfault"]
        const errorExists = Object.values(successList).some((value)=>(
           errors.includes(value as string)
        ))

        if(errorExists){
            return res.status(501).json({message:"AI promptu veritabanına kaydedilirken sorun oluştu.",success:success,successList:successList
            })
        }else {
            success=true
            return res.status(201).json({message:"AI promptu başarıyla kaydedildi.",success:success,successList:successList
            })
        }

    }else {

         return res.status(501).json({message:"ElasticSearch indexi oluşturulurken sorun oluştu."})
    }

   

}



export const SaveAIPrompt = async (req:Request,res:Response,next:NextFunction) => {

    const role = req.headers["x-user-role"]

    if(role!="admin" && role!="staff"){
        return res.status(404).json({message:"Yetkilendirmede sorun var."})
     
    }

   const {kind,sendedId,prompt,result,embedding} = req.body

   


   if(await CreateIndex()){
        //index oluştu devam et
        const elasticId = randomUUID()

        const elasticResult = await CreateEmbedIndex({id:elasticId,sendedId:sendedId,kind:kind,embedding:embedding});

        if(!elasticResult){
            return res.status(501).json({message:"ElasticSearch a kaydetme başarısız oldu."})
        }
        
        if(kind == "application"){
        const appInfo = await prisma.jobapplication.findUnique({where:{id:sendedId}})

        if(!appInfo){
            return res.status(404).json({message:"İş başvurusu bilgisi bulunamadı."})
        }


        const saveprompt = await prisma.aIPrompts.create({data:{kind:kind,applicationId:appInfo.id,promptText:prompt,responseText:result,elasticId:elasticId}})

            if(saveprompt){
                return res.status(201).json({message:"AI Promptu başarıyla kaydedildi."})
            }else {
                    return res.status(501).json({message:"AI promptu veritabanına kaydedilirken sorun oluştu."})
            }


        }else if(kind == "staff"){
            const personInfo = await prisma.staff.findUnique({where:{id:sendedId}})

            if(!personInfo){
                return res.status(404).json({message:"Personel bilgisi bulunamadı."})
            }
            const saveprompt = await prisma.aIPrompts.create({data:{kind:kind,staffId:personInfo.id,promptText:prompt,responseText:result,elasticId:elasticId}})
                if(saveprompt){
                return res.status(201).json({message:"AI Promptu başarıyla kaydedildi."})
                }else {
                    return res.status(501).json({message:"AI promptu veritabanına kaydedilirken sorun oluştu."})
                }
        }

   }else {
    return res.status(501).json({message:"ElasticSearch indexi oluşturulurken sorun oluştu."})
   }

   
    return next();
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

    let personInfo = null
    let jobInfo = null

    if(kind == "application"){

        const appInfo = await prisma.jobapplication.findUnique({where:{id:id}})

        if(!appInfo){
            return res.status(404).json({message:"İş başvurusu bilgisi bulunamadı."})
        }

        if(!appInfo.jobId
        ){

            return res.status(404).json({message:"İş başvurusunda iş bilgisi bulunamadı."})
        }

        const jobInfoApp = await prisma.jobs.findUnique({where:{id:appInfo.jobId}})

        if(!jobInfoApp) {
            return res.status(404).json({message:"İş başvurusu yapan kullanıcı için iş bilgisi bulunamadı."})
        }

        personInfo = appInfo
        jobInfo = jobInfoApp

    }else if(kind == "staff") {
        const staffInfo = await prisma.staff.findUnique({where:{id:id}})

        if(!staffInfo){
            return res.status(404).json({message:"Personel bilgisi bulunamadı."})
        }

       if(!staffInfo.jobId){

            return res.status(404).json({message:"Personel bilgileri arasında iş bilgisi bulunamadı."})
        }

        const jobInfoStaff = await prisma.jobs.findUnique({where:{id:staffInfo.jobId}})

        if(!jobInfoStaff) {
            return res.status(404).json({message:"Personel için için iş bilgisi bulunamadı."})
        }

        personInfo = staffInfo
        jobInfo = jobInfoStaff

    }


    if(personInfo==null || jobInfo==null){
        console.log(kind," ",id)
        return res.status(404).json({message:"Personel veya iş başvurusu bilgisi bulunamadı."})
    }

     if(!personInfo.jobId || !personInfo.university || !personInfo.abilities || !personInfo.unidepartment || !personInfo.address ||
            !personInfo.graduatedate || !personInfo.selfbio || !personInfo.county || !personInfo.city || !jobInfo.jobtitle || !jobInfo.jobrequirements
    ){
            console.log(personInfo) 
            console.log(jobInfo)
            return res.status(404).json({message:"Personel veya iş başvurusu bilgileri bulunamadı."})
    }

    const promptInput : PromptInput = {
        name:personInfo.name,university:personInfo.university,unidepartment:personInfo.unidepartment
            ,graduatedate:personInfo.graduatedate.toISOString(),abilities:personInfo.abilities,address:personInfo.address,birthdate:personInfo.birthdate.toISOString()
            ,selfbio:personInfo.selfbio,city:personInfo.city,county:personInfo.county,jobtitle:jobInfo.jobtitle,jobrequirements:jobInfo.jobrequirements
    }

    const prompt = generatePrompt(promptInput)
    const response = await sendPromptToAgent(role,prompt);

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
        return res.status(201).json({sendedId:id,prompt:prompt,airesponse:responseText,embedding:embeddingResponse})
     }else {
        return res.status(404).json({message:"Response içeriği alma başarısız",sendedId:id,prompt:prompt,airesponse:responseText,embedding:embeddingResponse})
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
    
    
    const resultarr : {sendedId:string,prompt:string,result:string,embedding:Record<string,unknown> | null}[]  = []
    let resultcount = 0
    let errorsList = {}
  
    await Promise.all(idList.map( async (id : string)=>{
          
       
    let personInfo = null
    let jobInfo = null

    if(kind == "application"){

        const appInfo = await prisma.jobapplication.findUnique({where:{id:id}})

        if(!appInfo){
            //return res.status(404).json({message:"İş başvurusu bilgisi bulunamadı."})
            errorsList = {...errorsList,[id]:"jobappfault"}
            return;
        }

        if(!appInfo.jobId
        ){

            //return res.status(404).json({message:"İş başvurusunda iş bilgisi bulunamadı."})
            errorsList = {...errorsList,[id]:"jobappfault"}
            return;
        }

        
        const jobInfoApp = await prisma.jobs.findUnique({where:{id:appInfo.jobId}})

        if(!jobInfoApp) {
            //return res.status(404).json({message:"İş başvurusu yapan kullanıcı için iş bilgisi bulunamadı."})
            errorsList = {...errorsList,[id]:"jobfault"}
            return;
        }

        personInfo = appInfo
        jobInfo = jobInfoApp

    }else if(kind == "staff") {
        const staffInfo = await prisma.staff.findUnique({where:{id:id}})

        if(!staffInfo){
            //return res.status(404).json({message:"Personel bilgisi bulunamadı."})
            errorsList = {...errorsList,[id]:"stafffault"}
            return;
        }

       if(!staffInfo.jobId){

            //return res.status(404).json({message:"Personel bilgileri arasında iş bilgisi bulunamadı."})
            errorsList = {...errorsList,[id]:"stafffault"}
            return;
        }

        const jobInfoStaff = await prisma.jobs.findUnique({where:{id:staffInfo.jobId}})

        if(!jobInfoStaff) {
            //return res.status(404).json({message:"Personel için için iş bilgisi bulunamadı."})
            errorsList = {...errorsList,[id]:"jobfault"}
            return;
        }

        personInfo = staffInfo
        jobInfo = jobInfoStaff

    }

        if(personInfo==null || jobInfo==null){
            //return res.status(404).json({message:"Personel veya iş başvurusu bilgisi bulunamadı."})
            errorsList = {...errorsList,[id]:"infofault"}
            return;
        }

        if(!personInfo.jobId || !personInfo.university || !personInfo.abilities || !personInfo.unidepartment || !personInfo.address ||
                !personInfo.graduatedate || !personInfo.selfbio || !personInfo.county || !personInfo.city || !jobInfo.jobtitle || !jobInfo.jobrequirements
        ){

                //return res.status(404).json({message:"Personel veya iş başvurusu bilgileri bulunamadı."})

            errorsList = {...errorsList,[id]:"infofault"}
            return;
        }

        const promptInput : PromptInput = {
            name:personInfo.name,university:personInfo.university,unidepartment:personInfo.unidepartment
                ,graduatedate:personInfo.graduatedate.toISOString(),abilities:personInfo.abilities,address:personInfo.address,birthdate:personInfo.birthdate.toISOString()
                ,selfbio:personInfo.selfbio,city:personInfo.city,county:personInfo.county,jobtitle:jobInfo.jobtitle,jobrequirements:jobInfo.jobrequirements
        }
        

         const prompt = generatePrompt(promptInput)
        const response = await sendPromptToAgent(role,prompt);

        const messageOutput = response.outputs.find(output=>output.type == "message.output")
        
        if (!messageOutput || !("content" in messageOutput)) {
            errorsList = {...errorsList,[id]:"resultfault"}
            return;
        }

        const responseText =
            typeof messageOutput.content === "string"
                ? messageOutput.content
                : messageOutput.content
                    .filter(chunk => chunk.type === "text")
                    .map(chunk => ("text" in chunk ? chunk.text : ""))
                    .join("");
                    
       
        
        if(responseText){
             const embeddingResponse = await getEmbedding(responseText)
             if(embeddingResponse){
                resultcount+=1
                resultarr.push({sendedId:id,prompt:prompt,result:responseText,embedding:embeddingResponse})
             }else {
                resultarr.push({sendedId:id,prompt:prompt,result:responseText,embedding:null})
             }
        }else {
            errorsList = {...errorsList,[id]:"resultfault"}
            return;
            
        }
    }));

    const errors = ["resultfault","stafffault","infofault","jobappfault","elasticfault","jobfault"]
    const errorExists = Object.values(errorsList).some((value)=>(
           errors.includes(value as string)
        ))
    
    if(resultcount==0 || errorExists){
        return res.status(404).json({result:resultarr,errors:errorsList});
    }

    return res.status(201).json({result:resultarr});
}


