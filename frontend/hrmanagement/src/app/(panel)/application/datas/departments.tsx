import axios from "axios"
import axiosInstance from "@/app/utils/axiosInstance"

export type Department =  {
name:string
}

type DepResponse =  {
    data:Department[]
}


export const getDepartments = async (): Promise<Department[]> => {
    const response = await axiosInstance.get<DepResponse>(`${process.env.NEXT_PUBLIC_SERVER_URI}/job/get-all-departments`)
    const dep =  response.data
    return dep.data
}

