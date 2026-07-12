
import { ValidationError } from "@hrmanagement/error-handler";
import {prisma}  from "@hrmanagement/prisma"
import bcrypt  from "bcryptjs"
import { Request,Response,NextFunction } from "express";


export const getStaffByFilter = async (req:any,res:Response,next:NextFunction) => {

      try {
                    const {name,email,departmentId,phone_number,city,jobId} = req.body;
                    let whereclause = {}
                        if(name!=""){
                            whereclause = {...whereclause,name:name}
                        }
    
                        if(email!=""){
                            whereclause = {...whereclause,email:email}
                        }

                        if(departmentId!=""){ 
                                whereclause = {...whereclause,departmentId:departmentId}
                        }

                        if(phone_number!=""){
                                whereclause = {...whereclause,phone_number:phone_number}
                        }
        
                        if(city!=""){
                                whereclause = {...whereclause,city:city}
                        }

                        if(jobId!=""){
                                whereclause = {...whereclause,jobId:jobId}
                        }

                        const staff = await prisma.staff.findMany({where:whereclause})

                        if(staff){
                            
                            res.status(201).json({
                                success:true,
                                message:"Staff found !",
                                data: staff
                                
                                });
                        }else {
                            return next(new ValidationError("Staff not Found"))
                        }
                    
                    }catch(error){
                        return next(error);
                    }

}


export const getUserAndStaffByFilter = async (req:any,res:Response,next:NextFunction) => {

                   
                    try {
                        const {name,email,departmentId,phone_number,city,jobId} = req.body;
                        let whereclause0 = {}
                        let whereclause = {}
                         if(name!=""){
                            whereclause0 = {...whereclause0,name:name}
                        }
    
                        if(email!=""){
                            whereclause0 = {...whereclause0,email:email}
                        }
                         if(departmentId!=""){ 
                                whereclause0 = {...whereclause0,departmentId:departmentId}
                            }
        
                            if(phone_number!=""){
                                whereclause = {...whereclause,phone_number:phone_number}
                            }
        
                            if(city!=""){
                                whereclause = {...whereclause,city:city}
                            }

                            if(jobId!=""){
                                whereclause = {...whereclause,jobId:jobId}
                            }

                        const user = await prisma.users.findMany({where:{...whereclause0,staffInfo:{
                            some: {
                                ...whereclause
                            }
                        }},include:{staffInfo:true} })


                        if(user){


                            const safeUsers = user.map((u) => {
                                        const { password, ...safeUser } = u;
                                        return safeUser;
                                        });
                            
                                res.status(201).json({
                                success:true,
                                message:"User found !",
                                data: safeUsers
                                });
                            
                    }else {
                                return next(new ValidationError("User Not Found"))
                            }
                   
    
                }catch(error){
                    return next(error);
                }
                
                
}


export const getAllUserAndStaff = async (req:any,res:Response,next:NextFunction) => {
                   
                    try {

                        const page = Math.max(Number(req.query.page) || 1 ,1)
                        const limit = Math.min(Number(req.query.limit) || 10 ,100)
                        
                        const skip = (page-1) * limit


                        const [user,total] = await Promise.all([prisma.users.findMany({skip,take:limit,orderBy:{
                            signupdate:"desc"
                        },include:{staffInfo:true
                        }}
                        ),
                        prisma.users.count()
                        ])
                                if(user){
                                const safeUsers = user.map((u) => {
                                        const { password, ...safeUser } = u;
                                        return safeUser;
                                        });
                                res.status(201).json({
                                success:true,
                                message:"User found !",
                                data: safeUsers,
                                total,
                                page,
                                limit,
                                totalPages:Math.ceil(total/limit)
                                });
                                
                            }else {
                                        return next(new ValidationError("Users Not Found"))
                                    }
                   
    
                }catch(error){
                    return next(error);
                }
                
}


export const getAllStaff = async (req:any,res:Response,next:NextFunction) => {
    try {
                       const page = Math.max(Number(req.query.page) || 1 ,1)
                        const limit = Math.min(Number(req.query.limit) || 10 ,100)
                        
                        const skip = (page-1) * limit


                        const [staff,total] = await Promise.all([ prisma.staff.findMany({skip,take:limit,orderBy:{
                            signupdate:"desc"
                        }}),
                        prisma.staff.count()

                        ])
                        if(staff){
                                
                                res.status(201).json({
                                success:true,
                                message:"All staff found !",
                                data: staff,
                                total,
                                page,
                                limit,
                                totalPages:Math.ceil(total/limit)
                                })
                            }else {
                                        return next(new ValidationError("Staff Not Found"))
                                    }
    
                }catch(error){
                    return next(error);
                }
}



export const getStaff = async (req:any,res:Response,next:NextFunction) => {

                    const {id} = req.params
                    try {

                        const staff = await prisma.staff.findUnique({where:{id:id} })


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


export const getUserAndStaff = async (req:any,res:Response,next:NextFunction) => {
            
                
                    const {id} = req.params
                
                    try {

                        const user = await prisma.users.findUnique({where:{id:id},include:{staffInfo:true} })


                        if(user){

                               const { password, ...safeUser } = user;


                                res.status(201).json({
                                success:true,
                                message:"User found !",
                                data: safeUser
                                });
                            
                    }else {
                                return next(new ValidationError("User Not Found"))
                            }
                   
    
                }catch(error){
                    return next(error);
                }
                
}



export const staffUpdate = async(req:any,res:Response,next:NextFunction) => {
    
     const {name,email,userId,staffId,phone_number,city,jobId,country,county,
        address,postcode,university,unidepartment,unifaculty,graduatedate,githublink
    ,linkedinlink,abilities,selfbio,birthdate,departmentId} = req.body;

    var abilitiesstr = abilities.join(",")

     try {
    
    let staff = null
    if(userId!=undefined){
    const staffFound = await prisma.staff.findFirst({
            where: {
                userId: userId,
            },
            select: {
                id: true,
            },
            });
    if(staffFound){
    staff = await prisma.staff.update({
                        where:{id:staffFound.id},
                        data:{
                            name:name,
                            email:email,
                            phone_number:phone_number,
                            city:city,
                            jobId:jobId,
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
                            abilities:abilitiesstr,
                            selfbio:selfbio,
                            birthdate:birthdate,
                            departmentId:departmentId
                        }
                    })
                }
    }else {
        staff = await prisma.staff.update({
                        where:{id:staffId},
                        data:{
                            name:name,
                            email:email,
                            phone_number:phone_number,
                            city:city,
                            jobId:jobId,
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
                            abilities:abilitiesstr,
                            selfbio:selfbio,
                            birthdate:birthdate,
                            departmentId:departmentId
                        }
                    })
    }
                    if(staff){
                        res.status(201).json({
                        success:true,
                        message:"Staff updated successfully",
                        data:staff
                        
                        });
                    }else {
                       return next(new ValidationError("Staff Cannot Updated"))
                    }
                

            }catch(error){
                return next(error);
            }
}



export const staffDelete = async (req:any,res:Response,next:NextFunction) => {

     const  {userId,staffId} = req.body

    try {
                if(userId!=undefined){
                        
                        const existingStaff = await prisma.staff.findFirst({where:{userId:userId}})
                        if(!existingStaff){
                                return next(new ValidationError("Staff infos does not exists"))
                        }else {
                                        const deletestaff = await prisma.staff.delete({
                                            where:{id:existingStaff.id}
                                        })
                                        if(deletestaff){
                                            res.status(201).json({
                                                    success:true,
                                                    message:"Staff deleted successfully !"
                                                    });
                                        
                                        }else {
                                            return next(new ValidationError("User cannot deleted"))
                                        }
                                    
                        }

                }else {

                     const existingStaff = await prisma.staff.findUnique({where:{id:staffId}})
                        if(!existingStaff){
                                return next(new ValidationError("Staff infos does not exists"))
                        }else {
                                        const deletestaff = await prisma.staff.delete({
                                            where:{id:staffId}
                                        })
                                        if(deletestaff){
                                            res.status(201).json({
                                                    success:true,
                                                    message:"Staff deleted successfully !"
                                                    });
                                        
                                        }else {
                                            return next(new ValidationError("User cannot deleted"))
                                        }
                                    
                                    
                        }
                }
                            
             

        }catch(error){
            return next(error);
        }

}


//sadece staff veya user ve staff
export const createStaff= async (req:Request,res:Response,next:NextFunction) => {

     const {name,email,password,phone_number,city,jobId,country,county,
        address,postcode,university,unidepartment,unifaculty,graduatedate,githublink
    ,linkedinlink,abilities,selfbio,birthdate,departmentId} = req.body;

    var signupdate = new Date().toISOString()
    var abilitiesstr = abilities.join(",")
   
        
     try {  
                if(password!=undefined){
                const hashedPassword = await bcrypt.hash(password,10)
                const user = await prisma.users.create({ data:{
                                name:name,
                                email:email,
                                role:"staff",
                                password:hashedPassword,
                                staffInfo:{
                                    create:{
                                    name:name,
                                    email:email,
                                    phone_number:phone_number,
                                    city:city,
                                    jobId:jobId,
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
                                    abilities:abilitiesstr,
                                    selfbio:selfbio,
                                    birthdate:birthdate,
                                    signupdate:signupdate,
                                    departmentId:departmentId
                                    }
                                },
                                signupdate:signupdate,
                                departmentId:departmentId,
                            },
                            include:{
                                staffInfo:true
                            }
                                
                    })

                     if(user){
                        res.status(201).json({
                        success:true,
                        message:"User and staff created successfully",
                        });
                    }else {
                       return next(new ValidationError("Staff Cannot Created"))
                    }
                }else {
                     const staff = await prisma.staff.create({data:{
                                name:name,
                                email:email,
                                phone_number:phone_number,
                                city:city,
                                jobId:jobId,
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
                                abilities:abilitiesstr,
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
                        });
                    }else {
                       return next(new ValidationError("Staff Cannot Created"))
                    }
                }

                   
               

            }catch(error){
                return next(error);
            }

}






