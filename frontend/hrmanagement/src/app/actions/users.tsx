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



export type SendStatus  ={
    status:string,
    returnValue:AIResponse | AIResponseElement[] | null;
}


export const getStaffAddStatus = async (jobId:string) : Promise<string> => {

     return new Promise((resolve, reject) => {

        const timer = setInterval(async () => {

            try {

                 const res = await axiosInstance.get(`${process.env.NEXT_PUBLIC_SERVER_URI}/staff/get-staff-created-status/${jobId}`);
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


export const saveMultipileAIAnswerRequest = async (requests:SaveRequest[],currentpage:number,currentlimit:number): Promise<string | null> => {
    
   
    
    const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/ai-service/save-multipile-prompt`,{
        kind:"staff",
        infoList:requests,
        currentpage:currentpage,
        currentlimit:currentlimit,
        currenttype:""
    })
   if(response.status == 201){
        return response.data.id
    }
    return null
   
}  
