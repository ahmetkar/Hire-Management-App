import axiosInstance from "../utils/axiosInstance";


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