import axios from "axios"


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
}

type JobResponse =  {
    data:Job
}

type JobsResponse  = {
    data:Job[]
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