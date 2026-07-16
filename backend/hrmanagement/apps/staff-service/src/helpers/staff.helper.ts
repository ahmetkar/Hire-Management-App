import { ValidationError } from "@hrmanagement/error-handler";
import {prisma}  from "@hrmanagement/prisma"

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
        const staff = await prisma.staff.create({data:{
                                        name:jobApp.name,
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
                                        departmentId:"6a4249b2b1459f6e87f6795c"
                            }
                        })
                        

                            if(staff){
                                console.log("New staff created from approved job application")
                            }else {
                            console.log("New staff cannot created from approved job application")
                            }
                        }
}

