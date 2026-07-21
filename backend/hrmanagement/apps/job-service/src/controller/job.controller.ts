import { Request,Response,NextFunction } from "express";
import {prisma}  from "@hrmanagement/prisma"
import { ValidationError } from "@hrmanagement/error-handler";
import { publishJobAppCreated } from "../events/producers/jobAppCreated.producers";
import { publishJobAppDenied } from "../events/producers/jobAppDenied.producers";
import { publishJobAppApproved } from "../events/producers/jobAppApproved.producers";
import { getOrSetRedisCache, invalidateCacheTagKeys } from "../helpers/redis.helper";
import crypto from "crypto"
import { jobAppQueue } from "../queues/job.queue";

enum JobAppStatus {
    NEW="new",
    WAITING="waiting",
    APPROVED="approved",
    DISAPPROVED="disapproved"
}


export const searchAllJobApplication = async (req:Request,res:Response,next:NextFunction) => {



            const page = Math.max(Number(req.query.page) || 1 ,1)
            const limit = Math.min(Number(req.query.limit) || 10 ,100)
            const type = req.query.type
            const searchstr = req.query.searchstr?.toString()
            
             let whereclause = {}

            if(type == JobAppStatus.NEW){
                whereclause = {disapproved:false,managerapproved:false,staffapproved:false}
            }else if(type == JobAppStatus.WAITING){
                whereclause = {disapproved:false,managerapproved:false,staffapproved:true}
            }else if(type == JobAppStatus.APPROVED){
                whereclause = {disapproved:false,managerapproved:true}
            }else if(type == JobAppStatus.DISAPPROVED) {
                whereclause = {disapproved:true}
            }

            const skip = (page-1) * limit

            try {

                    const [data,total] = await Promise.all([getOrSetRedisCache(`jobapp:${type}:${searchstr}:${page}:${limit}`,`cache-tag:jobapp:${type}`,()=>prisma.jobapplication.findMany({
                        skip:skip,take:limit,orderBy:{
                            appdate:'desc'
                        },where:{...whereclause, OR : [{name:{contains:searchstr}},{email:{contains:searchstr}}]},include : {position:true,appPrompts:true}}),60*60),
                        getOrSetRedisCache(`jobapp:count:${type}:${searchstr}`,`cache-tag:jobapp:${type}`,()=>prisma.jobapplication.count({where:{...whereclause, OR : [{name:{contains:searchstr}},{email:{contains:searchstr}}]}}),60*60)
                    ])

                    if(data){
                        res.status(201).json({
                        success:true,
                        message:"Applications found !",
                        data: data,
                        page:page,
                        limit:limit,
                        total:total,
                        totalPages:Math.ceil(total/limit)
                        });
                    }else {
                       return next(new ValidationError("Job Application Not Found"))
                    }
               

            }catch(error){
                return next(error);
            }
}

export const getAllJobApplication = async (req:Request,res:Response,next:NextFunction) => {

            const page = Math.max(Number(req.query.page) || 1 ,1)
            const limit = Math.min(Number(req.query.limit) || 10 ,100)
            const type = req.query.type
            
            let whereclause = {}

            if(type == JobAppStatus.NEW){
                whereclause = {disapproved:false,managerapproved:false,staffapproved:false}
            }else if(type == JobAppStatus.WAITING){
                whereclause = {disapproved:false,managerapproved:false,staffapproved:true}
            }else if(type == JobAppStatus.APPROVED){
                whereclause = {disapproved:false,managerapproved:true}
            }else if(type == JobAppStatus.DISAPPROVED) {
                whereclause = {disapproved:true}
            }


            const skip = (page-1) * limit

            try {
                    const [data,total] = await Promise.all([getOrSetRedisCache(`jobapp:${type}:${page}:${limit}`,`cache-tag:jobapp:${type}`,()=>
                        prisma.jobapplication.findMany({
                        skip:skip,take:limit,orderBy:{
                            appdate:'desc'
                        },where:{...whereclause},include : {position:true,appPrompts:true}})
                        ,60*60),
                        getOrSetRedisCache(`jobapp:count:${type}`,`cache-tag:jobapp:${type}`,()=>prisma.jobapplication.count({where:{...whereclause}}),60*60)
                    ])

                    if(data){
                        res.status(201).json({
                        success:true,
                        message:"Applications found !",
                        data: data,
                        page:page,
                        limit:limit,
                        total:total,
                        totalPages:Math.ceil(total/limit)
                        });
                    }else {
                       return next(new ValidationError("Job Application Not Found"))
                    }
               

            }catch(error){
                return next(error);
            }

}


export const getMultipileJobApplication = async (req:Request,res:Response,next:NextFunction) => {

           const {page,limit,idList} = req.body


            const _page = Math.max(Number(page) || 1 ,1)
            const _limit = Math.min(Number(limit) || 10 ,100)


            const skip = (_page-1) * _limit

            const idlistkey = crypto.createHash("sha256").update(JSON.stringify(idList)).digest("hex")


            try {
 
                    const [data,total] = await Promise.all([getOrSetRedisCache(`jobapp:${idlistkey}:${_page}:${_limit}`,`cache-tag:jobapp`,()=>prisma.jobapplication.findMany({
                        skip:skip,take:_limit,orderBy:{
                            appdate:'desc'
                        },where:{id:{in:idList}},include : {position:true,appPrompts:true}}),60*60),
                        getOrSetRedisCache(`jobapp:count:${idlistkey}`,`cache-tag:jobapp`,()=>prisma.jobapplication.count({where:{id:{in:idList}}}),60*60)
                    ])

                    if(data){
                        res.status(201).json({
                        success:true,
                        message:"Applications found !",
                        data: data,
                        page:_page,
                        limit:_limit,
                        total:total,
                        totalPages:Math.ceil(total/_limit)
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

                const page = Math.max(Number(req.query.page) || 1 ,1)
                const limit = Math.min(Number(req.query.limit) || 10 ,100)
                
                const skip = (page-1) * limit

                
                    
                    const [data,total] = await Promise.all([getOrSetRedisCache(`job:${page}:${limit}`,`cache-tag:job`,()=>prisma.jobs.findMany({
                        skip,take:limit,orderBy:{
                            createdate:'desc'
                        }
                    }),6*60*60)
                    ,
                    getOrSetRedisCache(`job:count`,`cache-tag:job`,()=>prisma.jobs.count(),6*60*60)
                    ])

                    if(data){
                        res.status(201).json({
                        success:true,
                        message:"Jobs found !",
                        data: data,
                        total,
                        page,
                        limit,
                        totalPages:Math.ceil(total/limit)

                        });
                    }else {
                       return next(new ValidationError("Jobs Not Found"))
                    }
               

            }catch(error){
                return next(error);
            }

}

export const getOneJobApplication = async (req:Request,res:Response,next:NextFunction) => {

        const id = req.params.id ? String(req.params.id) : undefined;
    
            try {
                
                    
                    const job = getOrSetRedisCache(`jobapp:${id}`,`cache-tag:jobapp:${id}`,async ()=>await prisma.jobapplication.findMany({where:{id:id},include:{appPrompts:true}}),60*60)
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
    
                    if(req.headers["x-user-id"]){
                        const job = getOrSetRedisCache(`job:${id}`,`cache-tag:job:${id}`,async ()=>await prisma.jobs.findUnique({where:{id:id},include:{department:true}}),6*60*60)
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
                        const job = await prisma.jobs.findUnique({where:{id:id},include:{department:true}})
                        if(job){
                            res.status(201).json({
                            success:true,
                            message:"Job found !",
                            data: {
                                id: job.id,
                                jobtitle: job.jobtitle,
                                jobrequirements: job.jobrequirements,
                                jobnotes: job.jobnotes,
                                department: job.department,
                                position: job.position,
                                mounthlywage: job.mounthlywage,
                                weeklypayment: job.weeklypayment,
                                dailypayment: job.dailypayment,
                                createdate: job.createdate,
                                expiredate: job.expiredate     
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

     const page = Math.max(Number(req.query.page) || 1 ,1)
     const limit = Math.min(Number(req.query.limit) || 10 ,100)

     const skip = (page-1) * limit

     const {jobId,name,email,phone_number,city} = req.body;
    
            try {
                    let whereclause = {}
                    let redisfilterkey = "jobapp"
                    if(jobId!=""){ 
                        whereclause = {...whereclause,jobId:jobId}
                        redisfilterkey = redisfilterkey+`:${jobId}`
                    }
                    if(name!=""){
                        whereclause = {...whereclause,name:name}
                        redisfilterkey = redisfilterkey+`:${name}`
                    }

                    if(email!=""){
                        whereclause = {...whereclause,email:email}
                        redisfilterkey = redisfilterkey+`:${email}`
                    }

                    if(phone_number!=""){
                        whereclause = {...whereclause,phone_number:phone_number}
                        redisfilterkey = redisfilterkey+`:${phone_number}`
                    }

                    if(city!=""){
                        whereclause = {...whereclause,city:city}
                        redisfilterkey = redisfilterkey+`:${city}`
                    }

                    const rediskey = redisfilterkey+`:${page}:${limit}`
                    
                    const [job,total] = await Promise.all([getOrSetRedisCache(rediskey,`cache-tag:jobapp`,()=>prisma.jobapplication.findMany({skip,take:limit,orderBy:{
                        appdate:"desc"
                    },where:whereclause,include:{appPrompts:true}}),60*60),
                    getOrSetRedisCache(`jobapp:count:${redisfilterkey}`,`cache-tag:jobapp`,()=>prisma.jobapplication.count(),60*60)
                    ])
                    if(job){
                        res.status(201).json({
                        success:true,
                        message:"Application found !",
                        data: job,
                        page:page,
                        limit:limit,
                        total:total,
                        totalPages:Math.ceil(total/limit)
                        });
                    }else {
                        return next(new ValidationError("Job Application Not Found"))
                    }
               

            }catch(error){
                return next(error);
            }
}

export const getJobByFilter = async (req:Request,res:Response,next:NextFunction) => {

    const page = Math.max(Number(req.query.page) || 1 ,1)
     const limit = Math.min(Number(req.query.limit) || 10 ,100)

     const skip = (page-1) * limit

     const {id,title,position,departmentId,userId} = req.body;

     let redisfilterkey = "job"
    
            try {
                    let whereclause = {}
                    if(id!=""){ 
                        whereclause = {...whereclause,id:id}
                        redisfilterkey = redisfilterkey+`:${id}`
                    }
                    if(title!=""){
                        whereclause = {...whereclause,title:title}
                        redisfilterkey = redisfilterkey+`:${title}`
                    }

                    if(position!=""){
                        whereclause = {...whereclause,position:position}
                        redisfilterkey = redisfilterkey+`:${position}`
                    }

                    if(departmentId!=""){
                        whereclause = {...whereclause,departmentId:departmentId}
                        redisfilterkey = redisfilterkey+`:${departmentId}`
                    }

                    if(userId!=""){
                        whereclause = {...whereclause,responsibleUserId:userId}
                        redisfilterkey = redisfilterkey+`:${userId}`
                    }

                    const rediskey = redisfilterkey+`:${page}:${limit}`
                    
                    const [job,total] = await Promise.all([getOrSetRedisCache(rediskey,`cache-tag:job`,()=>prisma.jobs.findMany({skip,take:limit,orderBy:{
                        createdate:"desc"
                    },where:whereclause}),6*60*60),
                    getOrSetRedisCache(`job:count:${redisfilterkey}`,`cache-tag:job`,()=>prisma.jobs.count(),6*60*60)
                     ])

                    if(job){
                        res.status(201).json({
                        success:true,
                        message:"Jobs found !",
                        data: job,
                        total:total,
                        page:page,
                        limit:limit,
                        totalPages:Math.ceil(total/limit)
                        })
                   
                    }else {
                        return next(new ValidationError("Jobs Not Found"))
                    }
               

            }catch(error){
                return next(error);
            }
}

export const createJobApplication= async (req:Request,res:Response,next:NextFunction) => {
    const {jobId,name,email,phone_number,city,country,county,
        address,postcode,university,unidepartment,unifaculty,graduatedate,githublink
    ,linkedinlink,abilities,selfbio,birthdate,agreeterms,ipadress} = req.body;

   var appdate = new Date().toISOString()


    const abilitiesstr = abilities.join(",")


     try {
        const data = {name:name,
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
                            agreeterms:agreeterms,
                            appdate:appdate,
                            ipadress:ipadress,}
                            
            const jobApp = await jobAppQueue.add("job-app-create",{data:data})
                    
                    /*const job = await prisma.jobapplication.create({
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
                            agreeterms:agreeterms,
                            appdate:appdate,
                            ipadress:ipadress,
                        }
                    })*/


                    if(jobApp.id){

                       /* publishJobAppCreated({
                        key:job.id,jobAppId:job.id,name:name,email:email,jobId:jobId,ipaddress:ipadress===undefined ? "" : ipadress,message:"Application created"
                        })
                        invalidateCacheTagKeys(`cache-tag:jobapp:${JobAppStatus.NEW}`)*/

                        res.status(201).json({
                            status:"waiting",
                            id:jobApp.id                        
                        });
                    }else {
                       return next(new ValidationError("Job Application Cannot Send"))
                    }
               

            }catch(error){
                return next(error);
            }





}

export const denyJobApplication = async (req:any,res:Response,next:NextFunction) => {
     
     const {id} = req.body;


     const deniedById = req.headers["x-user-id"]
     const role = req.headers["x-user-role"]
        

     try {

                    const job = await prisma.jobapplication.findMany({where:{id:id}})


                    if(job){
                        
                        const denyjob = await prisma.jobapplication.update({
                        where:{id:id},
                        data:{
                            managerapproved:false,
                            staffapproved:false,
                            disApproverId:deniedById,
                            disapproved:true      
                        }
                    })
                    if(denyjob){

                        publishJobAppDenied({key:denyjob.id,deniedById:deniedById,role:role,jobAppId:denyjob.id,jobId:denyjob.jobId!,
                            name:denyjob.name,email:denyjob.email,message:"Job application denied"})
                        
                        invalidateCacheTagKeys(`cache-tag:jobapp:${JobAppStatus.DISAPPROVED}`)
                        res.status(201).json({
                        
                        data:{success:true,message:"Successfully disapproved !"}
                        });
                    }else {
                       return next(new ValidationError("Job Application Cannot Disapproved "))
                    }

                }else {
                    return next(new ValidationError("Job Application Cannot Found"))
                }
               

            }catch(error){
                return next(error);
            }



}

export const approveJobApplication = async (req:any,res:Response,next:NextFunction) => {

    const {id} = req.body


     const existingJob = await prisma.jobapplication.findUnique({where:{id:id}})

    if(!existingJob){
            return next(new ValidationError("Job application does not exists with that id"))
    }
                const approverId = req.headers["x-user-id"]
                const role = req.headers["x-user-role"]



                    let job = null;
                    
                    if(role == "admin" && (!existingJob.managerapproved)){
                    job = await prisma.jobapplication.update({
                        where:{id:id},
                        data:{
                            disapproved:false,
                            managerApproverId:approverId,
                            managerapproved:true
                        }
                    })
                    invalidateCacheTagKeys(`cache-tag:jobapp:${JobAppStatus.APPROVED}`)
                    }else if(role== "staff" && (!existingJob.staffapproved)) {
                         job = await prisma.jobapplication.update({
                        where:{id:id},
                        data:{
                            disapproved:false,
                            userApproverId:approverId,
                            staffapproved:true      
                        }
                    })
                    invalidateCacheTagKeys(`cache-tag:jobapp:${JobAppStatus.WAITING}`)
                    }

                    if(job){
                        publishJobAppApproved({key:id,approverId:approverId,role:role,jobAppId:id,jobId:job.jobId!,
                            name:job.name,email:job.email,message:"Job application approved"})

                        
                        res.status(201).json({
                         data:{success:true,message:"Successfully approved !"}
                        
                        });
                    }else {
                        return next(new ValidationError("Job cannot approved"))
                    }



}

export const createJob = async (req:any,res:Response,next:NextFunction) => {


     const {jobtitle,jobrequirements,jobnotes,departmentId,position,mounthlywage,weeklypayment,dailypayment,expiredate,responsibleUserId} = req.body;

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
                            departmentId:departmentId,
                            position:position,
                            ...wageclause,
                            createdByUserId:createdByUserId,
                            createdate: createdate,
                            expiredate:expiredate,
                            responsibleUserId:responsibleUserId
                        }
                    })
                    if(job){
                        invalidateCacheTagKeys("cache-tag:job")

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

    const {jobId,jobtitle,jobrequirements,jobnotes,departmentId,position,mounthlywage,weeklypayment,dailypayment,expiredate,responsibleUserId} = req.body;
 
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
                            departmentId:departmentId,
                            position:position,
                            ...wageclause,
                            expiredate:expiredate,
                            responsibleUserId:responsibleUserId
                        }
                    })
                    if(job){
                        invalidateCacheTagKeys("cache-tag:job")
                        invalidateCacheTagKeys(`cache-tag:job:${jobId}`)
                       
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
                invalidateCacheTagKeys(`cache-tag:job:${id}`)
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