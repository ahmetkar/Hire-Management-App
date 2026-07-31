import axios from "axios";
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


export type AnalysisStatus  ={
    status:string,
    returnValue:SearchResult[]
}

export type SendStatus  ={
    status:string,
    returnValue:AIResponse | AIResponseElement[] | null;
}




export const getJobAppAddStatus = async (jobId:string) : Promise<string> => {

     return new Promise((resolve, reject) => {

        const timer = setInterval(async () => {

            try {

                 const res = await axiosInstance.get(`${process.env.NEXT_PUBLIC_SERVER_URI}/job/get-jobapp-created-status/${jobId}`);
                if(res.status == 200){
                    if (res.data.status === "completed") {

                        clearInterval(timer);

                        resolve(res.data.status);
                    }

                     if(res.data.status === "active" || res.data.status === "waiting" || res.data.status== "delayed" ){
                        return;
                    }

                    if (res.data.status === "failed") {

                        clearInterval(timer);

                        reject(res.data.status);
                    }

            }

            } catch (err) {

                clearInterval(timer);

                reject(err);
            }


        }, 2000);

    });
          
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


export const getAnalysisStatus = async (jobId:string) : Promise<AnalysisStatus> => {

     return new Promise((resolve, reject) => {

        const timer = setInterval(async () => {

            try {

                 const res = await axiosInstance.get(`${process.env.NEXT_PUBLIC_SERVER_URI}/ai-service/get-elastic-status/${jobId}`);

                if (res.data.status === "completed") {

                    const data = res.data as AnalysisStatus
                    clearInterval(timer);

                    resolve(data);
                }

                   if(res.data.status === "active" || res.data.status === "waiting" || res.data.status== "delayed" ){
                        return;
                    }

                if (res.data.status === "failed") {

                    clearInterval(timer);

                    reject({status:res.data.status,returnValue:null});
                }

            } catch (err) {

                clearInterval(timer);

                reject({status:"failed",returnValue:null});
            }

        }, 2000);

    });
          
}

export const getSendStatus = async (jobId:string) : Promise<SendStatus> => {

    return new Promise((resolve, reject) => {

        const timer = setInterval(async () => {

            try {

                 const res = await axiosInstance.get(`${process.env.NEXT_PUBLIC_SERVER_URI}/ai-service/get-send-status/${jobId}`);
                if(res.status == 200){
                    if (res.data.status === "completed") {

                    
                        const data = res.data as SendStatus
                        clearInterval(timer);

                        resolve(data);
                    }

                    if(res.data.status === "active" || res.data.status === "waiting" || res.data.status== "delayed" ){
                        return;
                    }

                    if (res.data.status === "failed") {

                        clearInterval(timer);

                        reject({status:"failed",returnValue:null});
                    }

            }

            } catch (err) {

                 
                clearInterval(timer);
                console.log(err)

                reject({status:"failed",returnValue:null});

            
            }


        }, 2000);

    });
}

export const getSaveStatus = async (jobId:string) : Promise<string> => {

     return new Promise((resolve, reject) => {

        const timer = setInterval(async () => {

            try {

                 const res = await axiosInstance.get(`${process.env.NEXT_PUBLIC_SERVER_URI}/ai-service/get-save-status/${jobId}`);
                if(res.status == 200){
                    if (res.data.status === "completed") {

                        clearInterval(timer);

                        resolve(res.data.status);
                    }

                     if(res.data.status === "active" || res.data.status === "waiting" || res.data.status== "delayed" ){
                        return;
                    }

                    if (res.data.status === "failed") {

                        clearInterval(timer);

                        reject(res.data.status);
                    }

            }

            } catch (err) {

                clearInterval(timer);

                reject(err);
            }


        }, 2000);

    });
          
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


export const saveMultipileAIAnswerRequest = async (requests:SaveRequest[],currentpage:number,currentlimit:number,type:string): Promise<string | null> => {
    
   
    const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/ai-service/save-multipile-prompt`,{
        kind:"application",
        infoList:requests,
        currentpage:currentpage,
        currentlimit:currentlimit,
        currenttype:type
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