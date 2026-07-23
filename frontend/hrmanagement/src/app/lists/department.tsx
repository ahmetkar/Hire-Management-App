import axiosInstance from "../utils/axiosInstance";


export type Department =  {
 id: string;
 name:string;
 addingdate:Date;
}


export type DepartmentResponse  = {
    data:Department[],
    page:number,
    limit:number,
    total:number,
    totalPages:number
}




export const getDepartments = async (page:number,limit:number): Promise<DepartmentResponse> => {

    const response = await axiosInstance.get<DepartmentResponse>(`${process.env.NEXT_PUBLIC_SERVER_URI}/job/get-all-departments?page=${page}&limit=${limit}`)
    const depresp =  response.data
    return depresp

}


export const getDepartment = async (id:string): Promise<Department> => {

    const response = await axiosInstance.get<Department>(`${process.env.NEXT_PUBLIC_SERVER_URI}/job/get-department/${id}`)
    const depresp =  response.data
    return depresp

}

