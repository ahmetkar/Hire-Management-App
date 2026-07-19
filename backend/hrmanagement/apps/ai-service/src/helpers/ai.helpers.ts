import { Mistral } from "@mistralai/mistralai";
import type { CompletionArgs, ConversationInputs, ConversationResponse, EmbeddingResponse, FunctionTool } from "@mistralai/mistralai/models/components";



export type PromptInput = {
    name:string,university:string,unidepartment:string,graduatedate:string,abilities:string,
    address:string,birthdate:string,selfbio:string,city:string,county:string,
    jobtitle:string,jobrequirements:string,
}

export type InfoListElement = {name:string,jobId:string,university:string,unidepartment:string,graduatedate:string,abilities:string[],birthdate:string
        ,selfbio:string,address:string,county:string,city:string};

export function isInfoList(value: unknown): value is InfoListElement {
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
        
export const apiKey = process.env.API_KEY
        


export function generatePrompt(input:PromptInput){

   return `İsim ve soyisim : ${input.name},
             Mezun olduğu üniversite ve bölüm,mezuniyet tarihi : ${input.university} , ${input.unidepartment} , ${input.graduatedate},
             Yetenekleri : ${input.abilities} , Doğum tarihi : ${input.birthdate} , Biyografi : ${input.selfbio} , 
             Ev Adresi : ${input.address} , Yaşadığı şehir ve ilçe : ${input.city} - ${input.county}`  

}

export async function sendPromptToAgent( role:string,prompt:string
) : Promise<ConversationResponse>{
     const messages : ConversationInputs = [
        {
            "role":"user",
            "content":prompt
        }
    ]

    const completionArgs : CompletionArgs = {
            temperature: 0.7,
            maxTokens: 2048,
            topP: 1
    };

    const tools : FunctionTool[] = [];


    

     let instructions = ""
     
     if(role == "admin"){
        instructions =  `Sen bir işe alım yöneticisisin. Amacın işe alınacak kişileri seçmek. \n sSana adayın kişisel bilgileri verilecek ve hangi iş için uygun olduğu sorulacak.\n Üniversite eğitiminin iş ile alakalı olup olmadığını değerlendir.\nTecrübenin kullanıcı tarafından belirtilmişse uygun olup olmadığına bak belirtilmemişse bakma\nYeteneklerin belirtilen pozisyon için belirtilmiş gereken yeteneklere uygun olup olmadığına bak yoksa işin adına bakarak yetenekleri değerlendir.\nYaşı için özel bir bilgi verilmişse ona göre değerlendirme yap yoksa yaştan bahsetme.\nYaşadığı şehir için özel bir bilgi verilmişse ona göre değerlendirme yap yoksa bahsetme.\nProjelerin iş ile alakasını değerlendir.Pozisyon için belirtilen yeteneklere uygun projelermi onuda kontrol et.\nVe sonucu tek metin ile döndür. Ayrı başlıklar hiç olmasın.\n`
     }else if(role == "staff") {
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


export async function getEmbedding(input:string) : Promise<EmbeddingResponse>{
        const client = new Mistral({apiKey:apiKey})

        const messages : string[] = [
            input
        ]

         const embbedingResponse = await client.embeddings.create({    
            model:'mistral-embed',
            inputs:messages
         })

         return embbedingResponse
        
}