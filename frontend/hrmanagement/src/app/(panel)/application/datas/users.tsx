import axiosInstance from "@/app/utils/axiosInstance"

export type User =  {
id:string,
name:string,
role:string,
email:string
}

type UserResponse =  {
    data:User[]
}


export const getUsers = async (): Promise<User[]> => {
    const response = await axiosInstance.get<UserResponse>(`${process.env.NEXT_PUBLIC_SERVER_URI}/staff/get-users/user`)
    const dep =  response.data
    return dep.data
}

