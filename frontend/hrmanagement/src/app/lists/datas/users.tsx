import axiosInstance from "@/app/utils/axiosInstance"

export type User =  {
id:string,
name:string,
role:string,
email:string,
departmentId:string,
signupdate:string
}

export type UserResponse =  {
    data:User[],
    page:number,
    limit:number,
    total:number,
    totalPages:number
}

type OneUserResponse = {
    data:User
}

export type Staff = {
      id:string;
      name:string;
      email:string;
      phone_number:string;
      birthdate:string;
      university:string;
      unidepartment:string;
      graduatedate:string;
      address:string;
      city:string;
      country:string;
      jobId:string;
      county:string;
      postcode:string;
      githublink:string;
      linkedinlink:string;
      abilities:string;
      selfbio:string;
      departmentId:string;
      signupdate:string;
}


export type StaffUser = {
    id:string,
    name:string,
    role:string,
    email:string,
    departmentId:string,
    signupdate:string,
    staffInfo:Staff[],
    staffInfoOne:Staff
}

type OneStaffResponse = {
    data:Staff | StaffUser
}


export type StaffResponse =  {
    data:Staff[],
    page:number,
    limit:number,
    total:number,
    totalPages:number
}

export type StaffUserResponse =  {
    data:(StaffUser | undefined)[] ,
    page:number,
    limit:number,
    total:number,
    totalPages:number
}



export const searchUsers = async (search:string,page:number,limit:number): Promise<UserResponse> => {
    const response = await axiosInstance.get<UserResponse>(`${process.env.NEXT_PUBLIC_SERVER_URI}/auth/get-users`)
    const dep =  response.data
    return dep
}

export const getUsers = async (page:number,limit:number): Promise<UserResponse> => {
    const response = await axiosInstance.get<UserResponse>(`${process.env.NEXT_PUBLIC_SERVER_URI}/auth/get-users?page=${page}&limit=${limit}`)
    const dep =  response.data
    return dep
}



export const getAllStaff = async (page:number,limit:number): Promise<StaffResponse> => {
    const response = await axiosInstance.get<StaffResponse>(`${process.env.NEXT_PUBLIC_SERVER_URI}/staff/get-all-staff?page=${page}&limit=${limit}`)
    const dep =  response.data
    return dep
}

export const getAllUserAndStaff = async (page:number,limit:number): Promise<StaffUserResponse> => {
    const response = await axiosInstance.get<StaffUserResponse>(`${process.env.NEXT_PUBLIC_SERVER_URI}/staff/get-all-user-and-staff?page=${page}&limit=${limit}`)
    const dep =  response.data

    const dataclean = dep.data!.map((d)=>{

        if(d!=undefined){
             if(d.staffInfo != undefined) {
                d.staffInfoOne = d.staffInfo[0]
                return d
            } 
    }
    })

    dep.data = dataclean


    return dep
}



export const getUser = async (id:string): Promise<User> => {
    const response = await axiosInstance.get<OneUserResponse>(`${process.env.NEXT_PUBLIC_SERVER_URI}/auth/get-user/${id}`)
    const dep =  response.data
    return dep.data
}


export const getStaff = async (id:string): Promise<Staff> => {
    const response = await axiosInstance.get<OneStaffResponse>(`${process.env.NEXT_PUBLIC_SERVER_URI}/staff/get-staff/${id}`)
    const dep =  response.data
    return dep.data as Staff
}

export const getStaffAndUser = async (userId:string): Promise<StaffUser> => {
    const response = await axiosInstance.get<OneStaffResponse>(`${process.env.NEXT_PUBLIC_SERVER_URI}/staff/get-user-and-staff/${userId}`)
    const dep =  response.data
    return dep.data as StaffUser
}