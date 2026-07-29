import { Response } from "express";

export const clearCookie = (res:Response,name:string,path:string) => {
    res.clearCookie(name,{
        httpOnly:true,
        secure:process.env.NODE_ENV === "production" ? true : false,
        sameSite:process.env.NODE_ENV === "production" ? "none" : "lax",
        path
    })
}