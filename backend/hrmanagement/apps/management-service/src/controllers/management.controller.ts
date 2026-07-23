import { Request,Response,NextFunction } from "express";
import {prisma}  from "@hrmanagement/prisma"
import { ValidationError } from "@hrmanagement/error-handler";
import { getOrSetRedisCache, invalidateCacheTagKeys } from "../helpers/redis.helpers";

import { notifications } from "@prisma/client";


export const CreateOrUpdateSettings = async (req:Request,res:Response,next:NextFunction) => {


const {themecolor,timezone,language,sitetitle,sitedesc} = req.body;
     try {
                    let settings = null;

                    const lastSettings = await prisma.settings.findFirst({
                                orderBy: {
                                    id: "desc",
                                },
                                });
                    if(!lastSettings){
                            settings = await prisma.settings.create({
                            data:{
                                sitetitle:sitetitle,
                                sitedesc:sitedesc,
                                language:language,
                                themecolor:themecolor,
                                timezone:timezone
                            }
                        })
                    }else {
                        settings = await prisma.settings.update({

                            where:{id:lastSettings.id},
                            data:{
                                sitetitle:sitetitle,
                                sitedesc:sitedesc,
                                language:language,
                                themecolor:themecolor,
                                timezone:timezone
                            }
                        })

                    }

                    if(settings){
                        res.status(201).json({
                        success:true,
                        message:"Settings updated successfully.",    
                        });
                    }else {
                        return next(new ValidationError("Settings Cannot Updated "))
                    }
               

            }catch(error){
                return next(error);
            }

}

export const getSettings = async (req:Request,res:Response,next:NextFunction) => {


    
            try {
                
                    
                  const lastSettings = await prisma.settings.findFirst({
                                orderBy: {
                                    id: "desc",
                                },
                                });
                    if(lastSettings){
                        res.status(201).json({
                        success:true,
                        message:"Settings found !",
                        data: lastSettings
                        });
                    }else {
                        return next(new ValidationError("Settings Not Found"))
                    }
               

            }catch(error){
                return next(error);
            }
}

export const getNotifications = async (req:any,res:Response,next:NextFunction) => {

            const myId = req.headers["x-user-id"]
    

            try {
                

                const page = Math.max(Number(req.query.page) || 1 ,1)
                const limit = Math.min(Number(req.query.limit) || 5 ,25)
                
                const skip = (page-1) * limit

                    
                  const [notifications,count] = await Promise.all([ getOrSetRedisCache<notifications[]>(`notifications:${myId}:${page}:${limit}`,`cache-tag:notifications:${myId}`,()=>prisma.notifications.findMany({skip,take:limit,orderBy:{
                        id:'desc'
                  },
                                where:{
                                    toWhoId:myId
                                }
                                }),60*60),
                            getOrSetRedisCache(`notifications:count:${myId}`,`cache-tag:notifications:${myId}`,()=>prisma.notifications.count(),60*60)
                    ])
                    
                    if(notifications){
                        res.status(201).json({
                        success:true,
                        message:"Notifications found !",
                        data: notifications,
                        count,
                        page:page,
                        limit:limit,
                        totalPages:Math.ceil(count/limit),                });
                    }else {
                        return next(new ValidationError("Notifications Not Found"))
                    }
               

            }catch(error){
                return next(error);
            }
}


export const createNotification = async (req:Request,res:Response,next:NextFunction) => {

    const {title,desc,byWhoId,toWhoId,href} = req.body;

    const date = new Date().toISOString()

     try {
                    
                   
                    const notification = await prisma.notifications.create({
                            data:{
                                title:title,
                                desc:desc,
                                bywhoId:byWhoId,
                                toWhoId:toWhoId,
                                href:href,
                                date:date
                            }
                        })


                    if(notification){
                        invalidateCacheTagKeys(`cache-tag:notifications:${toWhoId}`)
                        res.status(201).json({
                        success:true,
                        message:"Notification created successfully.",    
                        });
                    }else {
                        return next(new ValidationError("Notification Cannot Updated "))
                    }
               

            }catch(error){
                return next(error);
            }

}




