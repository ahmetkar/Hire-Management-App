import axiosInstance from "../utils/axiosInstance";


export type AIResponse = {
    prompt:string;
    airesponse:string;
    embedding:Record<string,unknown> | null;

}

export type SaveRequest =  {
        sendedId:string;
        prompt:string;
        result:string;
        preembedding:Record<string,unknown> | null;
        embedding:unknown;
}

export type AnalysisResponse = {
    message:string;
    results:SearchResult[]
}


export type SearchResult  = {
    id:string;
    sendedId:string;
    kind:string;
    score:number | null | undefined;
    createdAt:string | null | undefined;
    updatedAt:string | null | undefined;
}





export const sendAIPromptRequest = async (appId:string): Promise<AIResponse> => {
    const response = await axiosInstance.post<AIResponse>(`${process.env.NEXT_PUBLIC_SERVER_URI}/ai-service/send-prompt`,{
        kind:"application",
        id:appId
    })
    const data =  response.data
    return data
}  


export const sendMultipileAIPromptRequest = async (appIdList:string[]): Promise<AIResponse[]> => {
    const response = await axiosInstance.post<AIResponse[]>(`${process.env.NEXT_PUBLIC_SERVER_URI}/ai-service/send-multipile-prompt`,{
        kind:"application",
        idList:appIdList
    })
    const data =  response.data
    return data
}  


export const sendAnalyisRequest = async (kind:string,appId:string): Promise<AnalysisResponse | null> => {
    let response = null
    if(kind == "oldest"){
        response = await axiosInstance.post<AnalysisResponse>(`${process.env.NEXT_PUBLIC_SERVER_URI}/ai-service/search-for-oldest`,{
            applicationId:appId
        })
    }else if(kind == "newest"){
        response = await axiosInstance.post<AnalysisResponse>(`${process.env.NEXT_PUBLIC_SERVER_URI}/ai-service/search-for-newest`,{
            applicationId:appId
        })
    }

    if(response!=null){
        const data =  response.data
        return data
    }
    return null
}  



export const saveAIAnswerRequest = async (appId:string,prompt:string,resp:string,embedding:Record<string,unknown>): Promise<string> => {
    let embed = null
    if(embedding != null){
    const embeddingArr = embedding.data as Record<string,unknown>[]
    embed = embeddingArr[0].embedding
    
    }
    const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/ai-service/save-prompt`,{
        kind:"application",
        sendedId:appId,
        prompt:prompt,
        result:resp,
        embedding:embed
    })
    const data =  response.data
    return data
}  


export const saveMultipileAIAnswerRequest = async (requests:SaveRequest[]): Promise<string> => {
    
    const reqs = requests.map((req)=>{
        let embed = null
        if(req.preembedding != null){
            const embeddingArr = req.preembedding.data as Record<string,unknown>[]
            embed = embeddingArr[0].embedding
            req.embedding = embed
        }
        return req
    })
    
    const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/ai-service/save-multipile-prompt`,{
        kind:"application",
        infoList:reqs
        
    })
    const data =  response.data
    return data
}  



export const approveJobApp = async (id:string): Promise<[string,boolean]> => {
    const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/job/approve-application`,{
        id:id
    })
    const msg =  response.data.message
    const success = response.data.success
    return [msg,success]
}  


export const disapproveJobApp = async (id:string): Promise<[string,boolean]> => {
    const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/job/deny-application`,{
        id:id
    })
   const msg =  response.data.message
    const success = response.data.success
    return [msg,success]
}  