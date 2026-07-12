
import axiosInstance from "../utils/axiosInstance";


export type Notification =  {
 title:string,
 desc:string,
 byWhoId:string,
 toWhoId:string,
 href:string,
 date:Date
}

export type NotificationResponse  = {
    data:Notification[],
    page:number,
    limit:number,
    total:number,
    totalPages:number
}


export const getNotifications = async (page:number,limit:number): Promise<NotificationResponse> => {

    const response = await axiosInstance.get<NotificationResponse>(`${process.env.NEXT_PUBLIC_SERVER_URI}/management/get-notifications?page=${page}&limit=${limit}`)
    const notresp =  response.data
    return notresp
}