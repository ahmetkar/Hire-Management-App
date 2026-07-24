import axiosInstance from "../utils/axiosInstance";



export type AIResponses  = {
    result:AIResponseElement[]
}

export type AIResponseResults  = {
    resultarr:AIResponseElement[]
}


export type AIResponseElement = {
    sendedId:string;
    result:string;
}

export type AIResponse = {
    sendedId:string;
    airesponse:string;
}

export type SaveRequest =  {
        sendedId:string;
        result:string;
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





export const sendAIPromptRequest = async (appId:string): Promise<string | null> => {
    const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/ai-service/send-prompt`,{
        kind:"application",
        id:appId
    })
    if(response.status == 201){
        return response.data.id
    }
    return null
}  


export const sendMultipileAIPromptRequest = async (appIdList:string[]): Promise<string | null> => {
    const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/ai-service/send-multipile-prompt`,{
        kind:"application",
        idList:appIdList
    })
    if(response.status == 201){
        return response.data.id
    }
    return null
}  


export const sendAnalyisRequest = async (kind:string,appId:string): Promise<string  | null> => {
    let response = null
    if(kind == "oldest"){
        response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/ai-service/search-for-oldest`,{
            applicationId:appId
        })
    }else if(kind == "newest"){
        response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/ai-service/search-for-newest`,{
            applicationId:appId
        })
    }

     if(response!=null && response.status == 201){
        return response.data.id
    }
    return null
}  



export const saveAIAnswerRequest = async (appId:string,resp:string): Promise<string | null> => {
  
    
    const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/ai-service/save-prompt`,{
        kind:"application",
        sendedId:appId,
        result:resp
    })
     if(response.status == 201){
        return response.data.id
    }
    return null
}  


export const saveMultipileAIAnswerRequest = async (requests:SaveRequest[]): Promise<string | null> => {
    
   
    const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/ai-service/save-multipile-prompt`,{
        kind:"application",
        infoList:requests
    })
     if(response.status == 201){
        return response.data.id
    }
    return null
   
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