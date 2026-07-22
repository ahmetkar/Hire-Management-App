import { ValidationError } from "@hrmanagement/error-handler";
import {prisma}  from "@hrmanagement/prisma"
import { staffQueue } from "../queue/staff.queue";

const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;


export const validateEmailData = (email: string) => {

    
    if(!emailRegex.test(email)){
        return new ValidationError(`Invalid email format`)
    }
    return true;
}


export const AddApprovedJobApplicationToStaff = async (jobAppId:string,jobId:string) => {
    
        const jobApp = await prisma.jobapplication.findUnique({where:{id:jobAppId}})

        const job = await prisma.jobs.findUnique({where:{id:jobId}})


        if(job && jobApp){


        var signupdate = new Date().toISOString()

        const data = {name:jobApp.name,
                                        email:jobApp.email,
                                        phone_number:jobApp.phone_number,
                                        city:jobApp.city,
                                        jobId:jobApp.jobId,
                                        country:jobApp.country,
                                        county:jobApp.county,
                                        address:jobApp.address,
                                        postcode:jobApp.postcode,
                                        university:jobApp.university,
                                        unidepartment:jobApp.unidepartment,
                                        unifaculty:jobApp.unifaculty,
                                        graduatedate:jobApp.graduatedate,
                                        githublink:jobApp.githublink,
                                        linkedinlink:jobApp.linkedinlink,
                                        abilities:jobApp.abilities,
                                        selfbio:jobApp.selfbio,
                                        birthdate:jobApp.birthdate,
                                        signupdate:signupdate,
                                        departmentId:job.departmentId}


                        const staffJob = await staffQueue.add("staff-create",{data:data})
                                            
                        
                        if(staffJob.id){
                                console.log("Staff job",staffJob.id," added from job application")
                        }else {
                                console.log("Staff job cannot added from job application")
                        }
        
                        }
}

