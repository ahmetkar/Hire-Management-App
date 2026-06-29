import { Request,Response,NextFunction } from "express";
import {prisma}  from "@hrmanagement/prisma"
import { ValidationError } from "@hrmanagement/error-handler";



export const getAllJobApplication = async (req:Request,res:Response,next:NextFunction) => {
     

            try {
                
                    
                    const jobs = await prisma.jobapplication.findMany()
                    if(jobs){
                        res.status(201).json({
                        success:true,
                        message:"Applications found !",
                        data: jobs
                        });
                    }else {
                       return next(new ValidationError("Job Application Not Found"))
                    }
               

            }catch(error){
                return next(error);
            }

}



export const getAllJobs = async (req:Request,res:Response,next:NextFunction) => {
     

            try {
                
                    
                    const jobs = await prisma.jobs.findMany()
                    if(jobs){
                        res.status(201).json({
                        success:true,
                        message:"Jobs found !",
                        data: jobs
                        });
                    }else {
                       return next(new ValidationError("Jobs Not Found"))
                    }
               

            }catch(error){
                return next(error);
            }

}




export const getOneJobApplication = async (req:Request,res:Response,next:NextFunction) => {

        const jobId = req.params.jobid ? String(req.params.jobid) : undefined;
    
            try {
                
                    
                    const job = await prisma.jobapplication.findMany({where:{jobId:jobId}})
                    if(job){
                        res.status(201).json({
                        success:true,
                        message:"Application found !",
                        data: job
                        });
                    }else {
                        return next(new ValidationError("Job Application Not Found"))
                    }
               

            }catch(error){
                return next(error);
            }

}

export const getOneJob = async (req:any,res:Response,next:NextFunction) => {

        const id = req.params.id ? String(req.params.id) : undefined;
    
            try {
                
                    if(req.header["x-user-id"]){
                        const job = await prisma.jobs.findMany({where:{id:id}})
                        if(job){
                            res.status(201).json({
                            success:true,
                            message:"Job found !",
                            data: job
                            });
                        }else {
                            return next(new ValidationError("Job Not Found"))
                        }
                    }else {
                        const job = await prisma.jobs.findMany({where:{id:id}})
                        if(job){
                            res.status(201).json({
                            success:true,
                            message:"Job found !",
                            data: {
                                id: job[0].id,
                                jobtitle: job[0].jobtitle,
                                jobrequirements: job[0].jobrequirements,
                                jobnotes: job[0].jobnotes,
                                department: job[0].department,
                                position: job[0].position,
                                mounthlywage: job[0].mounthlywage,
                                weeklypayment: job[0].weeklypayment,
                                dailypayment: job[0].dailypayment,
                                createdate: job[0].createdate,
                                expiredate: job[0].expiredate     
                            }
                            });
                        }else {
                            return next(new ValidationError("Job Not Found"))
                        }
                    }
                    
               

            }catch(error){
                return next(error);
            }

}

export const getJobApplicationByFilter = async (req:Request,res:Response,next:NextFunction) => {

     const {jobId,name,email,phone_number,city} = req.body;
    
            try {
                    let whereclause = {}
                    if(jobId!=""){ 
                        whereclause = {...whereclause,jobId:jobId}
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
                    
                    const job = await prisma.jobapplication.findMany({where:whereclause})
                    if(job){
                        res.status(201).json({
                        success:true,
                        message:"Application found !",
                        data: job
                        });
                    }else {
                        return next(new ValidationError("Job Application Not Found"))
                    }
               

            }catch(error){
                return next(error);
            }
}

export const getJobByFilter = async (req:Request,res:Response,next:NextFunction) => {

     const {id,title,position,department,userId} = req.body;
    
            try {
                    let whereclause = {}
                    if(id!=""){ 
                        whereclause = {...whereclause,id:id}
                    }
                    if(title!=""){
                        whereclause = {...whereclause,title:title}
                    }

                    if(position!=""){
                        whereclause = {...whereclause,position:position}
                    }

                    if(department!=""){
                        whereclause = {...whereclause,department:department}
                    }

                    if(userId!=""){
                        whereclause = {...whereclause,responsibleUserId:userId}
                    }
                    
                    const job = await prisma.jobs.findMany({where:whereclause})
                    if(job){
                        res.status(201).json({
                        success:true,
                        message:"Jobs found !",
                        data: job
                        });
                    }else {
                        return next(new ValidationError("Jobs Not Found"))
                    }
               

            }catch(error){
                return next(error);
            }
}

export const createJobApplication= async (req:Request,res:Response,next:NextFunction) => {
    const {jobId,name,email,phone_number,city,position,country,county,
        address,postcode,university,unidepartment,unifaculty,graduatedate,githublink
    ,linkedinlink,abilities,selfbio,birthdate,agreeterms,ipadress} = req.body;

   var appdate = new Date().toISOString()

    const abilitiesstr = abilities.join(",")


     try {
                    
                    const job = await prisma.jobapplication.create({
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
                            abilities:abilitiesstr,
                            selfbio:selfbio,
                            birthdate:birthdate,
                            agreeterms:agreeterms,
                            appdate:appdate,
                            ipadress:ipadress,
                            jobId:jobId
                        }
                    })
                    if(job){
                        res.status(201).json({
                        success:true,
                        
                        });
                    }else {
                       return next(new ValidationError("Job Application Cannot Send"))
                    }
               

            }catch(error){
                return next(error);
            }





}

export const denyJobApplication = async (req:any,res:Response,next:NextFunction) => {
     
     const {oldId} = req.body;


     const deniedById = req.user.id;
        

     try {

                    const oldJob = await prisma.jobapplication.findMany({where:{id:oldId}})


                    if(oldJob){
                    
                    const job = await prisma.deniedApplications.create({
                        data:{
                            name:oldJob.name,
                            email:oldJob.email,
                            phone_number:oldJob.phone_number,
                            city:oldJob.city,
                            position:oldJob.position,
                            country:oldJob.country,
                            county:oldJob.county,
                            address:oldJob.address,
                            postcode:oldJob.postcode,
                            university:oldJob.university,
                            unidepartment:oldJob.unidepartment,
                            unifaculty:oldJob.unifaculty,
                            graduatedate:oldJob.graduatedate,
                            githublink:oldJob.githublink,
                            linkedinlink:oldJob.linkedinlink,
                            abilities:oldJob.abilities,
                            selfbio:oldJob.selfbio,
                            birthdate:oldJob.birthdate,
                            agreeterms:oldJob.agreeterms,
                            appdate:oldJob.appdate,
                            ipadress:oldJob.ipadress,
                            jobId:oldJob.jobId,
                            deniedById:deniedById
                        }
                    })
                    if(job){
                        res.status(201).json({
                        success:true,
                        
                        });
                    }else {
                       return next(new ValidationError("Job Application Cannot Denied"))
                    }

                }else {
                    return next(new ValidationError("Job Application Cannot Denied"))
                }
               

            }catch(error){
                return next(error);
            }



}

export const approveJobApplication = async (req:any,res:Response,next:NextFunction) => {

    const {appId} = req.body


     const existingJob = await prisma.jobapplication.findUnique({where:{id:appId}})

    if(!existingJob){
            return next(new ValidationError("Job application does not exists with that id"))
    }
                const approverId = req.user.id
                const role = req.user.role

   

                    let job = null;
                    
                    if(role == "admin"){
                    job = await prisma.jobapplication.update({
                        where:{id:appId},
                        data:{
                            approverId:approverId,
                            managerapproved:true
                        }
                    })
                    }else if(role== "user") {
                         job = await prisma.jobapplication.update({
                        where:{id:appId},
                        data:{
                            approverId:approverId,
                            staffapproved:true      
                        }
                    })
                    }

                    if(job){
                        res.status(201).json({
                        success:true,
                        message:"Job approved successfully.",
                        data:job
                        
                        });
                    }else {
                        return next(new ValidationError("Job cannot approved"))
                    }



}





export const createJob = async (req:any,res:Response,next:NextFunction) => {


     const {jobtitle,jobrequirements,jobnotes,department,position,mounthlywage,weeklypayment,dailypayment,expiredate,responsibleUserId} = req.body;

    console.log(req)
    var createdByUserId = req.headers["x-user-id"]
    var createdate = new Date().toISOString()

     try {

                    let wageclause = {}
                    if(mounthlywage!=""){
                        wageclause = {...wageclause,mounthlywage:mounthlywage}
                    }else if(dailypayment!=""){
                        wageclause = {...wageclause,dailypayment:dailypayment}
                    }else if(weeklypayment!=""){
                        wageclause = {...wageclause,weeklypayment:weeklypayment}
                    }
                    
                    
                    const job = await prisma.jobs.create({
                        data:{
                            jobtitle:jobtitle,
                            jobrequirements:jobrequirements,
                            jobnotes:jobnotes,
                            department:department,
                            position:position,
                            ...wageclause,
                            createdByUserId:createdByUserId,
                            createdate: createdate,
                            expiredate:expiredate,
                            responsibleUserId:responsibleUserId
                        }
                    })
                    if(job){
                        res.status(201).json({
                        success:true,
                        message:"Job created successfully.",
                        data:job
                        
                        });
                    }else {
                        return next(new ValidationError("Job Application Cannot Created "))
                    }
               

            }catch(error){
                return next(error);
            }

}

export const updateJob = async (req:Request,res:Response,next:NextFunction) => {

    const {jobId,jobtitle,jobrequirements,jobnotes,department,position,mounthlywage,weeklypayment,dailypayment,expiredate,responsibleUserId} = req.body;
 
    const existingJob = await prisma.jobs.findUnique({where:{id:jobId}})

    if(!existingJob){
            return next(new ValidationError("Job does not exists with that id"))
    }

     try {

                    let wageclause = {}
                    if(mounthlywage!=""){
                        wageclause = {...wageclause,mounthlywage:mounthlywage}
                    }else if(dailypayment!=""){
                        wageclause = {...wageclause,dailypayment:dailypayment}
                    }else if(weeklypayment!=""){
                        wageclause = {...wageclause,weeklypayment:weeklypayment}
                    }
                    
                    
                    const job = await prisma.jobs.update({
                        where:{id:jobId},
                        data:{
                            jobtitle:jobtitle,
                            jobrequirements:jobrequirements,
                            jobnotes:jobnotes,
                            department:department,
                            position:position,
                            ...wageclause,
                            expiredate:expiredate,
                            responsibleUserId:responsibleUserId
                        }
                    })
                    if(job){
                        res.status(201).json({
                        success:true,
                        message:"Job updated successfully.",
                        data:job
                        
                        });
                    }else {
                        return next(new ValidationError("Job Application Not Updated"))
                    }
               

            }catch(error){
                return next(error);
            }
}

export const deleteJob = async (req:Request,res:Response,next:NextFunction) => {
     try {
        const id = req.params.id ? String(req.params.id) : undefined;

        if(id!=undefined){

        const existingJob = await prisma.jobs.findUnique({where:{id:id}})

        if(!existingJob){
                return next(new ValidationError("Job does not exists"))
        }else {
            const deleted = await prisma.jobs.delete({
                where:{id:id}
            })
            if(deleted){
                   res.status(201).json({
                        success:true,
                        message:"Job deleted successfully !"
                        });
            
            }else {
                return next(new ValidationError("Job Application Not Deleted"))
            }
        }
        }else {
            return next(new ValidationError("Id Parameter Not Given"))
        }

    }catch(error){
        return next(error);
    }
}



export const createDepartment = async (req:Request,res:Response,next:NextFunction) => {
     try {
        if(req.body &&  Object.keys(req.body).length > 0){

        const {name} = req.body;

        var addingdate  = new Date().toISOString();
            

        const dep = await prisma.department.create({
            data : {name:name,addingdate:addingdate}
        })

        if(dep != null){
            res.status(201).json({
            success:true,
            message:"Department added succesfully !",
        });
        }else {
            return next(new ValidationError("Department cannot add"))
        }
    

        }
    }catch(error){
            return next(error);
        }



}


export const updateDepartment = async (req:Request,res:Response,next:NextFunction) => {

 try {
        if(req.body &&  Object.keys(req.body).length > 0){

        const {id,name} = req.body;


        const dep = await prisma.department.update({
            where:{id:id},
            data : {name:name}
        })

        if(dep != null){
            res.status(201).json({
            success:true,
            message:"Department updated succesfully !",
        });
        }else {
           return next(new ValidationError("Department cannot update"))
        }
    

        }
    }catch(error){
            return next(error);
        }


}


export const deleteDepartment = async (req:Request,res:Response,next:NextFunction) => {


 try {
    
        const id = req.params.id ? String(req.params.id) : undefined;

        const existingDep = await prisma.department.findUnique({where:{id:id}})

        if(!existingDep){
                return next(new ValidationError("Department does not exists"))
        }


        const dep = await prisma.department.delete({
            where:{id:id}
        })

        if(dep != null){
            res.status(201).json({
            success:true,
            message:`${existingDep.name} deleted succesfully !`,
        });
        }else {
          return next(new ValidationError("Job Application Cannot Deleted"))
        }
    

        
    }catch(error){
            return next(error);
        }

}

export const getAllDepartment = async (req:Request,res:Response,next:NextFunction) => {


            try {
                
                    const departments = await prisma.department.findMany();
                    if(departments){
                        res.status(201).json({
                        success:true,
                        message:"Departments found !",
                        data: departments
                        });
                    }else {
                        return next(new ValidationError("No departments exists"))
                    }
                

            }catch(error){
                return next(error);
            }
}



export const getOneDepartment = async (req:Request,res:Response,next:NextFunction) => {

    
            try {
                const id = req.params.id ? String(req.params.id) : undefined;

                const existingDep = await prisma.department.findUnique({where:{id:id}})

            
        
                    if(existingDep){
                        res.status(201).json({
                        success:true,
                        message:"Department found !",
                        data: existingDep
                        });
                    }else {
                          return next(new ValidationError("Department does not exists"))
                    }
                

            }catch(error){
                return next(error);
            }

}