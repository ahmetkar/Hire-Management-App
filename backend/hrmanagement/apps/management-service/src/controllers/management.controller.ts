import { Request,Response,NextFunction } from "express";
import {prisma}  from "@hrmanagement/prisma"
import { ValidationError } from "@hrmanagement/error-handler";




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

            const myId = req.header["x-user-id"]
    
            try {
                
                    
                  const notifications = await prisma.notifications.findMany({
                                where:{
                                    toWhoId:myId
                                }
                                });
                    if(notifications){
                        res.status(201).json({
                        success:true,
                        message:"Notifications found !",
                        data: notifications
                        });
                    }else {
                        return next(new ValidationError("Notifications Not Found"))
                    }
               

            }catch(error){
                return next(error);
            }
}


export const createNotification = async (req:Request,res:Response,next:NextFunction) => {

    const {title,desc,byWhoId,toWhoId} = req.body;

     try {
                    
                   
                    const notification = await prisma.notifications.create({
                            data:{
                                title:title,
                                desc:desc,
                                bywhoId:byWhoId,
                                toWhoId:toWhoId,
                            }
                        })


                    if(notification){
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




