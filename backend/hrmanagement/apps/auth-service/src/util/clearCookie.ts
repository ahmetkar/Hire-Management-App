import { Response } from "express";

export const clearCookie = (res:Response,name:string,path:string) => {
    res.clearCookie(name,{
        httpOnly:true,
        secure:true,
        sameSite:"none",
        path
    })
}