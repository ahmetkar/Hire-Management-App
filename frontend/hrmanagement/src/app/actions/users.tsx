import axiosInstance from "../utils/axiosInstance";

export type AIResponses  = {
    result:AIResponseElement[]
}


export type AIResponseElement = {
    sendedId:string;
    prompt:string;
    result:string;
    embedding:Record<string,unknown> | null;

}

export type AIResponse = {
    sendedId:string;
    prompt:string;
    airesponse:string;
    embedding:Record<string,unknown> | null;

}

export type SaveRequest =  {
        sendedId:string;
        prompt:string;
        result:string;
        preembedding:Record<string,unknown> | null;
        embedding:unknown | null;
}

export const sendAIPromptRequest = async (userId:string): Promise<AIResponse> => {
    const response = await axiosInstance.post<AIResponse>(`${process.env.NEXT_PUBLIC_SERVER_URI}/ai-service/send-prompt`,{
        kind:"staff",
        id:userId
    })
    const data =  response.data
    return data
}  


export const sendMultipileAIPromptRequest = async (userIdList:string[]): Promise<AIResponses> => {
    const response = await axiosInstance.post<AIResponses>(`${process.env.NEXT_PUBLIC_SERVER_URI}/ai-service/send-multipile-prompt`,{
        kind:"staff",
        idList:userIdList
    })
    const data =  response.data
    return data
}  



export const saveAIAnswerRequest = async (userId:string,prompt:string,resp:string,embedding:Record<string,unknown>): Promise<string> => {
    let embed = null
    if(embedding != null){
    const embeddingArr = embedding.data as Record<string,unknown>[]
    embed = embeddingArr[0].embedding
    
    }
    const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/ai-service/save-prompt`,{
        kind:"staff",
        sendedId:userId,
        prompt:prompt,
        result:resp,
        embedding:embed
    })
    const data =  response.data
    return data
}  


export const saveMultipileAIAnswerRequest = async (requests:SaveRequest[]): Promise<boolean> => {
    
   
    const reqs = requests.map((req)=>{
        if(req!=undefined){
            let embed = null
            if(req.preembedding != null){
                const embeddingArr = req.preembedding.data as Record<string,unknown>[]
                embed = embeddingArr[0].embedding
                req.embedding = embed
            }
            
        }
        return req
    })
    
    const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/ai-service/save-multipile-prompt`,{
        kind:"staff",
        infoList:reqs
    })
    const res =  response.data.success
    return res
   
}  
