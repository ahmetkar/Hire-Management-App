import { Response } from "express";

export const clearCookie = (res:Response,name:string,path:string) => {
    res.clearCookie(name,{
        httpOnly:true,
        secure:false,//process.env.NODE_ENV === "production",
        sameSite:"lax", //process.env.NODE_ENV === "production" ? "none" : "lax",
        path
    })
}