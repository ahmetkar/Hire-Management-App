import axios from "axios"
import axiosInstance from "../utils/axiosInstance";


export type JobApp =  {
 id: string;
 name:string;
 email:string;
 position:string;
 phone_number:string;
 country:string;
 city:string;
 county:string;
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
}

export type JobAppResponse =  {
    data:JobApp
}

type JobAppsResponse  = {
    data:JobApp[]
}


export const getJobApps = async (): Promise<JobApp[]> => {

    const response = await axiosInstance.get<JobAppsResponse>(`${process.env.NEXT_PUBLIC_SERVER_URI}/job/get-all-applications`)
    const job =  response.data
    return job.data

}   

export const getJobApp = async (id:string): Promise<JobApp> => {

    const response = await axios.get<JobAppResponse>(`${process.env.NEXT_PUBLIC_SERVER_URI}/job/get-one-application/${id}`)
    const job =  response.data
    return job.data

}

