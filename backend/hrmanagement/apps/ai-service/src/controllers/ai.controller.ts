import { Request,Response,NextFunction } from "express";
import {prisma}  from "@hrmanagement/prisma"


import { Mistral } from "@mistralai/mistralai";
import type { CompletionArgs, ConversationInputs, ConversationResponse, EmbeddingResponse, FunctionTool } from "@mistralai/mistralai/models/components";

type PromptInput = {
    role:string,name:string,university:string,unidepartment:string,graduatedate:string,abilities:string,
    address:string,birthdate:string,selfbio:string,city:string,county:string,
    jobtitle:string,jobrequirements:string,
}

type InfoListElement = {name:string,jobId:string,university:string,unidepartment:string,graduatedate:string,abilities:string[],birthdate:string
        ,selfbio:string,address:string,county:string,city:string};

 const apiKey = process.env.API_KEY

async function sendPromptToAgent( input:PromptInput
) : Promise<ConversationResponse>{
     const messages : ConversationInputs = [
        {
            "role":"user",
            "content":`İsim ve soyisim : ${input.name},
             Mezun olduğu üniversite ve bölüm,mezuniyet tarihi : ${input.university} , ${input.unidepartment} , ${input.graduatedate},
             Yetenekleri : ${input.abilities} , Doğum tarihi : ${input.birthdate} , Biyografi : ${input.selfbio} , 
             Ev Adresi : ${input.address} , Yaşadığı şehir ve ilçe : ${input.city} - ${input.county}`  
        }
    ]

    const completionArgs : CompletionArgs = {
            temperature: 0.7,
            maxTokens: 2048,
            topP: 1
    };

    const tools : FunctionTool[] = [];


    

     let instructions = ""
     
     if(input.role == "admin"){
        instructions =  `Sen bir işe alım yöneticisisin. Amacın işe alınacak kişileri seçmek. \n sSana adayın kişisel bilgileri verilecek ve hangi iş için uygun olduğu sorulacak.\n Üniversite eğitiminin iş ile alakalı olup olmadığını değerlendir.\nTecrübenin kullanıcı tarafından belirtilmişse uygun olup olmadığına bak belirtilmemişse bakma\nYeteneklerin belirtilen pozisyon için belirtilmiş gereken yeteneklere uygun olup olmadığına bak yoksa işin adına bakarak yetenekleri değerlendir.\nYaşı için özel bir bilgi verilmişse ona göre değerlendirme yap yoksa yaştan bahsetme.\nYaşadığı şehir için özel bir bilgi verilmişse ona göre değerlendirme yap yoksa bahsetme.\nProjelerin iş ile alakasını değerlendir.Pozisyon için belirtilen yeteneklere uygun projelermi onuda kontrol et.\nVe sonucu tek metin ile döndür. Ayrı başlıklar hiç olmasın.\n`
     }else if(input.role == "staff") {
        instructions =  `Sen bir ik görevlisisin. Amacın genel müdüre işe alınacak kişilerin seçimini yapmak. \nSana adayın kişisel bilgileri verilecek ve hangi iş için uygun olduğu sorulacak.\nÜniversite eğitiminin iş ile alakalı olup olmadığını değerlendir.\nTecrübenin kullanıcı tarafından belirtilmişse uygun olup olmadığına bak belirtilmemişse bakma\nYeteneklerin belirtilen pozisyon için belirtilmiş gereken yeteneklere uygun olup olmadığına bak yoksa işin adına bakarak yetenekleri değerlendir.\nYaşı için özel bir bilgi verilmişse ona göre değerlendirme yap yoksa yaştan bahsetme.\nYaşadığı şehir için özel bir bilgi verilmişse ona göre değerlendirme yap yoksa bahsetme.\nProjelerin iş ile alakasını değerlendir.Pozisyon için belirtilen yeteneklere uygun projelermi onuda kontrol et.\nVe sonucu tek metin ile döndür. Ayrı başlıklar hiç olmasın.\n`
     }
   


     const client = new Mistral({apiKey:apiKey})

     const response = await client.beta.conversations.start({
        inputs:messages,
        model: 'mistral-large-latest',
        instructions:instructions,
        completionArgs,
        tools,
     })

     return response
}


async function getEmbedding(input:string) : Promise<EmbeddingResponse>{
        const client = new Mistral({apiKey:apiKey})

        const messages : string[] = [
            input
        ]

         const embbedingResponse = await client.embeddings.create({    
            model:'mistral-embed',
            inputs:messages
         }  )

         return embbedingResponse
        
}


export const SendAIPrompt = async (req:Request,res:Response,next:NextFunction) => {


    const role = req.headers["x-user-role"]

    if(role!="admin" && role!="staff"){
        return res.status(404).json({message:"Yetkilendirmede sorun var."})
     
    }

    const {name,jobId,university,unidepartment,graduatedate,abilities,birthdate,selfbio,address
        ,county,city
    } = req.body



    const jobInfo = await prisma.jobs.findUnique({where:{id:jobId}})

    if(!jobInfo) {
        return res.status(404).json({message:"İş başvurusu yapan kullanıcı için iş bilgisi bulunamadı."})
    }

    const promptInput : PromptInput = {
        role:role,name:name,university:university,unidepartment:unidepartment
            ,graduatedate:graduatedate,abilities:abilities.join(","),address:address,birthdate:birthdate
            ,selfbio:selfbio,city:city,county:county,jobtitle:jobInfo.jobtitle,jobrequirements:jobInfo.jobrequirements
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
     }
     

}




 function isInfoList(value: unknown): value is InfoListElement {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  return (
    "name" in value &&
    typeof value.name === "string" &&
    "jobId" in value &&
    typeof value.jobId === "string" &&
    "university" in value &&
    typeof value.university === "string" &&
    "unidepartment" in value &&
    typeof value.unidepartment === "string" && 
    "graduatedate" in value &&
    typeof value.graduatedate === "string" &&
    "abilities" in value &&
    typeof value.abilities === "object" &&
    "birthdate" in value &&
    typeof value.birthdate === "string" &&
    "selfbio" in value &&
    typeof value.selfbio === "string" && 
    "address" in value &&
    typeof value.address === "string" &&
    "county" in value &&
    typeof value.county === "string" &&
    "city" in value &&
    typeof value.city === "string"
  );
}


export const SendMultipileAIPrompt = async (req:Request,res:Response,next:NextFunction) => {

     const role = req.headers["x-user-role"]


     if(role!="admin" && role!="staff"){
        return res.status(404).json({message:"Yetkilendirmede sorun var."})
     }

    const {userInfoList} = req.body
    
    let isArray = true

    if(typeof userInfoList == "object"){
        userInfoList.map((el : any)=>{
            if(!isInfoList(el)){
                isArray = false
            }
        })
    }else {
        isArray = false;
    }

    if(!isArray){
        return res.status(404).json({message:"İş başvurusu yapan kullanıcı verilen bilgilerin formatı yanlış."})
    }
    
    const airesponses : string[] = []
    const embeddingresponses:EmbeddingResponse[]=[]
  
    userInfoList.forEach( async (l : InfoListElement)=>{
          
        const jobInfo = await prisma.jobs.findUnique({where:{id:l.jobId}})

        if(!jobInfo) {
            return res.status(404).json({message:"İş başvurusu yapan kullanıcı için iş bilgisi bulunamadı."})
        }

        const promptInput : PromptInput = {
        role:role as string,name:l.name,university:l.university,unidepartment:l.unidepartment
            ,graduatedate:l.graduatedate,abilities:l.abilities.join(","),address:l.address,birthdate:l.birthdate
            ,selfbio:l.selfbio,city:l.city,county:l.county,jobtitle:jobInfo.jobtitle,jobrequirements:jobInfo.jobrequirements
        }
        const response = await sendPromptToAgent(promptInput);

        const messageOutput = response.outputs.find(output=>output.type == "message.output")

        if (!messageOutput || !("content" in messageOutput)) {
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
            airesponses.push(responseText)
             const embeddingResponse = await getEmbedding(responseText)
             embeddingresponses.push(embeddingResponse)
        }
    })
    

    return res.status(201).json({airesponses:airesponses,embeddingresponses:embeddingresponses});
}


export const SendRAGPrompt = async (req:Request,res:Response,next:NextFunction) => {

    return;
}

