
import { ValidationError } from "@hrmanagement/error-handler";
import {prisma}  from "@hrmanagement/prisma"
import { Request,Response,NextFunction } from "express";
import bcrypt  from "bcryptjs"



//usrtype paramları staff olarak geldiğinde tüm bilgileri alır yoksa sadece user bilgisini alır

export const getUserByFilter = async (req:any,res:Response,next:NextFunction) => {

              const usertype = req.params
     
                if(usertype == "staff"){
                   
                    try {
                        const {name,email,departmentId,phone_number,city,position} = req.body;
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

                            if(position!=""){
                                whereclause = {...whereclause,position:position}
                            }

                        const user = await prisma.users.findMany({where:{...whereclause0,staffInfo:{
                            is: {
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
                }else {

                try {
                    const {name,email,departmentId} = req.body;
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

                        const user = await prisma.users.findMany({where:whereclause})

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
                            return next(new ValidationError("User not Found"))
                        }
                    
                    }catch(error){
                        return next(error);
                    }

                }
                
}


export const getUsers = async (req:any,res:Response,next:NextFunction) => {
            
          
              const {usertype} = req.params
     
                if(usertype == "staff"){
                   
                    try {

                        const user = await prisma.users.findMany({include:{staffInfo:true
                        }})
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
                }else {

                try {
                   

                        const user = await prisma.users.findMany()

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
                            return next(new ValidationError("User not Found"))
                        }
                    
                    }catch(error){
                        return next(error);
                    }

                }
}


export const getUser = async (req:Request,res:Response,next:NextFunction) => {
            
                const {usertype,email} = req.body;
                if(usertype == "staff"){
                    
                   
                    try {

                        const user = await prisma.users.findMany({where:{email:email},include:{staffInfo:true} })


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
                }else {

                try {
                        const user = await prisma.users.findMany({where:{email:email}})

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
                            return next(new ValidationError("User not Found"))
                        }
                    
                    }catch(error){
                        return next(error);
                    }

                }
}


export const userUpdate = async (req:any,res:Response,next:NextFunction) => {

    
    const {usertype} = req.params;


    if(usertype == "staff"){

     const {name,email,password,role,phone_number,city,position,country,county,
        address,postcode,university,unidepartment,unifaculty,graduatedate,githublink
    ,linkedinlink,abilities,selfbio,birthdate,departmentId} = req.body;

     try {

                const existingUser = await prisma.users.findUnique({where:{email:email}})

                if(!existingUser){
                        return next(new ValidationError("User does not exists with that email"))
                }

                const newhashedPassword = await bcrypt.hash(password,10)

                const user = await prisma.users.update({
                    where:{email:email},
                    data:{name:name,email:email,password:newhashedPassword,role:role,departmentId:departmentId}
                })

                if(user){
                    
                    const staff = await prisma.staffInfo.update({
                        where:{userId:existingUser.id},
                        data:{
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
                        }
                    })
                    if(staff){
                        res.status(201).json({
                        success:true,
                        message:"Staff updated successfully",
                        data:staff
                        
                        });
                    }else {
                       return next(new ValidationError("User Cannot Updated"))
                    }
                }else {
                    return next(new ValidationError("User Cannot Updated"))
                }

            }catch(error){
                return next(error);
            }

        }else {

                try {
                const {name,email,password,role,departmentId} = req.body

                const existingUser = await prisma.users.findUnique({where:{email:email}})

                if(!existingUser){
                        return next(new ValidationError("User does not exists with that email"))
                }

                const newhashedPassword = await bcrypt.hash(password,10)

                const user = await prisma.users.update({
                    where:{email:email},
                    data:{name:name,email:email,password:newhashedPassword,role:role,departmentId:departmentId}
                })

                if(user){
                    res.status(201).json({
                                    success:true,
                                    message:"User updated successfully !",
                                    data: user
                                    });
                        }else {
                            return next(new ValidationError("User cannot updated"))
                        }

                }catch(error){
                    return next(error);
                }

    }
    
}


export const userDelete = async (req:Request,res:Response,next:NextFunction) => {


    let {id,usertype} = req.params

    id = id as string
    usertype = usertype as string


    if(usertype == "staff"){
            try {
                if(id!=undefined){
                
                const existingUser = await prisma.users.findUnique({where:{id:id}})
                
                if(!existingUser){
                        return next(new ValidationError("User does not exists"))
                }else {
                    const deleted = await prisma.users.delete({
                        where:{id:id}
                    })
                    if(deleted){
                        
                        const existingStaff = await prisma.staffInfo.findUnique({where:{userId:existingUser.id}})
                        if(!existingStaff){
                                return next(new ValidationError("Staff infos does not exists"))
                        }else {
                                        const deletestaff = await prisma.staffInfo.delete({
                                            where:{id:id}
                                        })
                                        if(deletestaff){
                                            res.status(201).json({
                                                    success:true,
                                                    message:"User deleted successfully !"
                                                    });
                                        
                                        }else {
                                            return next(new ValidationError("User cannot deleted"))
                                        }
                                    
                                    
                                    }
                }
            }
            }

        }catch(error){
            return next(error);
        }
    }else {
         try {
        

        if(id!=undefined){

        const existingUser = await prisma.users.findUnique({where:{id:id}})

        if(!existingUser){
                return next(new ValidationError("User does not exists"))
        }else {
            const deleted = await prisma.users.delete({
                where:{id:id}
            })
            if(deleted){
                   res.status(201).json({
                        success:true,
                        message:"User deleted successfully !"
                        });
            
            }else {
                return next(new ValidationError("User cannot deleted"))
            }
        }
        }else {
            return next(new ValidationError("Id parameter not given"))
        }

    }catch(error){
        return next(error);
    }
    }



}



export const createStaffAndUser= async (req:Request,res:Response,next:NextFunction) => {


     const {name,email,password,role,phone_number,city,position,country,county,
        address,postcode,university,unidepartment,unifaculty,graduatedate,githublink
    ,linkedinlink,abilities,selfbio,birthdate,departmentId} = req.body;

   var signupdate = new Date().toISOString()
   
    const hashedPassword = await bcrypt.hash(password,10)

     try {
                    
                    const user = await prisma.users.create({data:{
                        name:name,
                        email:email,
                        password:hashedPassword,
                        role:role,
                        staffInfo:{
                            create:{
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
                                birthdate:birthdate
                            }
                        },
                        departmentId:departmentId,
                        signupdate:signupdate
                    }})

                    if(user){
                        res.status(201).json({
                        success:true,
                        message:"Staff created successfully",
                        data:user
                        
                        });
                    }else {
                       return next(new ValidationError("Staff Cannot Created"))
                    }
               

            }catch(error){
                return next(error);
            }
}




