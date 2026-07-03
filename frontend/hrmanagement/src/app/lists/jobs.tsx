import axios from "axios"
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

export type JobResponse =  {
    data:Job,
}

export type JobsResponse  = {
    data:Job[],
      page:number,
    limit:number,
    total:number,
    totalPages:number
}


export const getJobs = async (page:number,limit:number): Promise<JobsResponse> => {

    const response = await axiosInstance.get<JobsResponse>(`${process.env.NEXT_PUBLIC_SERVER_URI}/job/get-all-jobs?page=${page}&limit=${limit}`)
    const jobresp =  response.data
    return jobresp

}

export const getJob = async (id:string): Promise<Job> => {

    const response = await axios.get<JobResponse>(`${process.env.NEXT_PUBLIC_SERVER_URI}/job/get-one-job/${id}`)
    const job =  response.data
    return job.data

}

export const getJobInfos = async (id:string): Promise<string[]> => {

    const response = await axios.get<JobResponse>(`${process.env.NEXT_PUBLIC_SERVER_URI}/job/get-one-job/${id}`)
    const job =  response.data
    return [job.data.jobrequirements,job.data.position]

}

