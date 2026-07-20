import axiosInstance from "../utils/axiosInstance";


export type Job =  {
 id: string;
 jobtitle: string;
 jobrequirements: string;
 jobnotes: string;
 department: string;
 position: string;
 mounthlywage: number | null;
 weeklypayment: number | null;
 dailypayment: number | null;
 expiredate: Date;
 createdate: Date;
 responsibleUserId:string;
 createdByUserId:string;
}

export type AIPrompt =  {
    kind:string;
    responseText:string;
}

export type JobApp =  {
 id: string;
 name:string;
 email:string;
 position:Job;
 phone_number:string;
 country:string;
 city:string;
 county:string;
 postcode:string;
 address:string;
 university:string;
 unidepartment:string;
 graduatedate:string;
 githublink:string;
 linkedinlink:string;
 abilities:string;
 selfbio:string;
 birthdate:string;
 agreeterms:string;
 appdate:string;
 staffapproved:boolean;
 managerapproved:boolean;
 disapproved:boolean;
 appPrompts:AIPrompt[];
}

export type JobAppResponse =  {
    data:JobApp[]
}

export type JobAppsResponse  = {
    data:JobApp[],
    page:number,
    limit:number,
    total:number,
    totalPages:number
}


export type JobsResponse  = {
    data:Job[],
    page:number,
    limit:number,
    total:number,
    totalPages:number
}



export const searchJobApps = async (searchstr:string,page:number,limit:number,type:string): Promise<JobAppsResponse> => {
    const response = await axiosInstance.get<JobAppsResponse>(`${process.env.NEXT_PUBLIC_SERVER_URI}/job/search-all-application?page=${page}&limit=${limit}&type=${type}&searchstr=${searchstr}`)
    const jobapps =  response.data
    return jobapps
}  

 

export const getJobApps = async (page:number,limit:number,type:string): Promise<JobAppsResponse> => {
    const response = await axiosInstance.get<JobAppsResponse>(`${process.env.NEXT_PUBLIC_SERVER_URI}/job/get-all-application?page=${page}&limit=${limit}&type=${type}`)
    const jobapps =  response.data
    return jobapps
}   


export const getMultipileJobApps = async (idList:string[],page:number,limit:number): Promise<JobAppsResponse> => {
    const response = await axiosInstance.post<JobAppsResponse>(`${process.env.NEXT_PUBLIC_SERVER_URI}/job/get-multipile-application`,{
        idList:idList,
        page:page,
        limit:limit
    })
    const jobapps =  response.data
    return jobapps
}   

export const getJobApp = async (id:string): Promise<JobApp> => {

    const response = await axiosInstance.get<JobAppResponse>(`${process.env.NEXT_PUBLIC_SERVER_URI}/job/get-one-application/${id}`)
    const job =  response.data
    const data = job.data[0]
    return data

}



