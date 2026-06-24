
import { ValidationError } from "@hrmanagement/error-handler";
import {prisma}  from "@hrmanagement/prisma"
import { Request,Response,NextFunction } from "express";



export const getAllStaff = async (req:Request,res:Response,next:NextFunction) => {


            try {
                
                    
                    const staff = await prisma.staff.findMany()
                    if(staff){
                        res.status(201).json({
                        success:true,
                        message:"Staff found !",
                        data: staff
                        });
                    }else {
                       return next(new ValidationError("Staff Not Found"))
                    }
               

            }catch(error){
                return next(error);
            }
}


export const getOneStaff = async (req:Request,res:Response,next:NextFunction) => {
    const staffId = req.params.staffid ? String(req.params.staffid) : undefined;
    
            try {
                
                    
                    const staff = await prisma.staff.findMany({where:{jobId:staffId}})
                    if(staff){
                        res.status(201).json({
                        success:true,
                        message:"Staff found !",
                        data: staff
                        });
                    }else {
                        return next(new ValidationError("Job Application Not Found"))
                    }
               

            }catch(error){
                return next(error);
            }
}

export const getStaffByFilter = async (req:Request,res:Response,next:NextFunction) => {

     const {departmentId,name,email,phone_number,city,position} = req.body;
        
                try {
                        let whereclause = {}
                        if(departmentId!=""){ 
                            whereclause = {...whereclause,departmentId:departmentId}
                        }
                        if(name!=""){
                            whereclause = {...whereclause,name:name}
                        }
    
                        if(email!=""){
                            whereclause = {...whereclause,email:email}
                        }
    
                        if(phone_number!=""){
                            whereclause = {...whereclause,phone_number:phone_number}
                        }
    
                        if(city!=""){
                            whereclause = {...whereclause,city:city}
                        }

                        if(position!=""){
                            whereclause = {...whereclause,position:position}
                        }
                        
                        const staff = await prisma.staff.findMany({where:whereclause})
                        if(staff){
                            res.status(201).json({
                            success:true,
                            message:"Staff found !",
                            data: staff
                            });
                        }else {
                            return next(new ValidationError("Staff Not Found"))
                        }
                   
    
                }catch(error){
                    return next(error);
                }
}

export const createStaff= async (req:Request,res:Response,next:NextFunction) => {


     const {name,email,phone_number,city,position,country,county,
        address,postcode,university,unidepartment,unifaculty,graduatedate,githublink
    ,linkedinlink,abilities,selfbio,birthdate,departmentId} = req.body;

   var signupdate = new Date().toISOString()

     try {
                    
                    const staff = await prisma.staff.create({
                        data:{
                            name:name,
                            email:email,
                            phone_number:phone_number,
                            city:city,
                            position:position,
                            country:country,
                            county:county,
                            address:address,
                            postcode:postcode,
                            university:university,
                            unidepartment:unidepartment,
                            unifaculty:unifaculty,
                            graduatedate:graduatedate,
                            githublink:githublink,
                            linkedinlink:linkedinlink,
                            abilities:abilities,
                            selfbio:selfbio,
                            birthdate:birthdate,
                            signupdate:signupdate,
                            departmentId:departmentId
                        }
                    })
                    if(staff){
                        res.status(201).json({
                        success:true,
                        message:"Staff created successfully",
                        data:staff
                        
                        });
                    }else {
                       return next(new ValidationError("Staff Cannot Created"))
                    }
               

            }catch(error){
                return next(error);
            }
}

export const updateStaff = async (req:Request,res:Response,next:NextFunction) => {

    
     const {id,name,email,phone_number,city,position,country,county,
        address,postcode,university,unidepartment,unifaculty,graduatedate,githublink
    ,linkedinlink,abilities,selfbio,birthdate,departmentId} = req.body;

     try {
                    
                    const staff = await prisma.staff.create({
                        where:{id:id},
                        data:{
                            name:name,
                            email:email,
                            phone_number:phone_number,
                            city:city,
                            position:position,
                            country:country,
                            county:county,
                            address:address,
                            postcode:postcode,
                            university:university,
                            unidepartment:unidepartment,
                            unifaculty:unifaculty,
                            graduatedate:graduatedate,
                            githublink:githublink,
                            linkedinlink:linkedinlink,
                            abilities:abilities,
                            selfbio:selfbio,
                            birthdate:birthdate,
                            departmentId:departmentId
                        }
                    })
                    if(staff){
                        res.status(201).json({
                        success:true,
                        message:"Staff created successfully",
                        data:staff
                        
                        });
                    }else {
                       return next(new ValidationError("Staff Cannot Created"))
                    }
               

            }catch(error){
                return next(error);
            }
}

export const deleteStaff = async (req:Request,res:Response,next:NextFunction) => {

    try {
        const id = req.params.id ? String(req.params.id) : undefined;

        if(id!=undefined){

        const existingStaff = await prisma.staff.findUnique({where:{id:id}})

        if(!existingStaff){
                return next(new ValidationError("Staff does not exists"))
        }else {
            const deleted = await prisma.staff.delete({
                where:{id:id}
            })
            if(deleted){
                   res.status(201).json({
                        success:true,
                        message:"Staff deleted successfully !"
                        });
            
            }else {
                return next(new ValidationError("Staff Not Deleted"))
            }
        }
        }else {
            return next(new ValidationError("Id Parameter Not Given"))
        }

    }catch(error){
        return next(error);
    }

}

