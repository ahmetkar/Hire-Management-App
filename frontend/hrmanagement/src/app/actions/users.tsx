import axiosInstance from "../utils/axiosInstance";

export type AIResponses  = {
    result:AIResponseElement[]
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

export const sendAIPromptRequest = async (userId:string): Promise<string | null> => {
    const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/ai-service/send-prompt`,{
        kind:"staff",
        id:userId
    })
    if(response.status == 201){
        return response.data.id
    }
    return null
}  


export const sendMultipileAIPromptRequest = async (userIdList:string[]): Promise<string | null> => {
    const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/ai-service/send-multipile-prompt`,{
        kind:"staff",
        idList:userIdList
    })
  if(response.status == 201){
        return response.data.id
    }
    return null
}  



export const saveAIAnswerRequest = async (userId:string,resp:string): Promise<string | null> => {

    const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/ai-service/save-prompt`,{
        kind:"staff",
        sendedId:userId,
        result:resp,
    })
     if(response.status == 201){
        return response.data.id
    }
    return null
}  


export const saveMultipileAIAnswerRequest = async (requests:SaveRequest[]): Promise<string | null> => {
    
   
    
    const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/ai-service/save-multipile-prompt`,{
        kind:"staff",
        infoList:requests
    })
   if(response.status == 201){
        return response.data.id
    }
    return null
   
}  
