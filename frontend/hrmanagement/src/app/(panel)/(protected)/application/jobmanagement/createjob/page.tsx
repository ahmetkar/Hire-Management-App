"use client";
import React, { useEffect, useState } from 'react'

import { Department,getDepartments } from '../../../../lists/department'

import { User,getUsers } from '../../../../lists/datas/users'

import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import axiosInstance from '@/app/utils/axiosInstance';



const Page = () => {

    const [departments, setDepartments] = useState<Department[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [send,setSend] = useState(false)
    const [success, setSuccess] = useState(false);


     useEffect(() => {
        getDepartments(1,10)
          .then((data) => setDepartments(data.data as Department[]))
          .catch((error) => console.error(error));

          getUsers(1,10)
          .then((data) => setUsers(data.data as User[]))
          .catch((error) => console.error(error));

     },[]);

     
       type FormData = {
           jobtitle:string;
           jobrequirements:string;
           jobnotes:string;
           position:string;
           mounthlywage:number;
           weeklypayment:number;
           dailypayment:number;
           expiredate:string;
           responsibleUserId:string;
           departmentId:string;
       };
     
     
       const [serverError,setServerError] = useState<string | null>(null)
     
     
     
         
        const {register,handleSubmit,formState:{errors}} = useForm<FormData>({});
     
       const onSubmit = (data:FormData) => {
         addJobMutation.mutate(data)
       };
     
       const addJobMutation = useMutation({
         mutationFn: async (data:FormData) => {
               data.expiredate = data.expiredate ? new Date(`${data.expiredate}T00:00:00.000Z`).toISOString(): ""

               if(data.mounthlywage) data.mounthlywage = Number(data.mounthlywage)
               const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/job/job-create`,data)
               setSend(true)
               return response.data
         },
         onSuccess:(data)=>{
             setServerError(null);  
             console.log(data)
             setSuccess(true)
         
         },
         onError: (error:AxiosError) => {
             const errorMsg = (error.response?.data as {message?:string})?.message || "İş ilanı gönderilemedi"
             console.log(errorMsg)
             setServerError(errorMsg);
             setSuccess(false)
         }
         
       })

   
  
  return (
     <div>
        {!send && (
           <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row justify-content-center">
            <div className="col-12">
              <h2 className="page-title">Yeni İş İlanı Ekle</h2>
             
              <div className="card shadow mb-4">
                
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label htmlFor="simpleinput">İş İlanı Başlığı : </label>
                        <input type="text" id="simpleinput" className="form-control"
                        {...register("jobtitle",{required: "Başlık bilgisi gereklidir."})}
                        />
                      </div>
                      <div className="form-group mb-3">
                        <label htmlFor="example-email">Pozisyon Adı :</label>
                        <input type="text" id="example-email" className="form-control" placeholder="Poziyon : Developer,IT Personel,IK Personel"
                        {...register("position",{required: "Pozisyon bilgisi gereklidir."})}
                        />

                          {errors.position && (
                            <p className='text-red-500 text-sm'>{String(errors.position.message)}</p>
                          )
                          }
                      </div>
                     
                      <div className="form-group mb-3">
                        <label htmlFor="example-palaceholder">Varsa Aylık Maaş :</label>
                        <input className="form-control" id="custom-phone" placeholder="..." 
                        {...register("mounthlywage")}
                        />
                        {errors.mounthlywage && (
                        <p className='text-red-500 text-sm'>{String(errors.mounthlywage.message)}</p>
                          )
                          }
                      </div>

                         <div className="form-group mb-3">
                        <label htmlFor="example-palaceholder">Varsa Haftalık Maaş :</label>
                        <input className="form-control" id="custom-phone" placeholder="..." 
                        {...register("weeklypayment")}
                        />

                        {errors.weeklypayment && (
                        <p className='text-red-500 text-sm'>{String(errors.weeklypayment.message)}</p>
                          )
                          }
                      </div>
                    </div> 
                    <div className="col-md-6">
                      
                         <div className="form-group mb-3">
                        <label htmlFor="example-palaceholder">Varsa Günlük Ücret :</label>
                        <input className="form-control" id="custom-phone" placeholder="..." 
                        {...register("dailypayment")}
                        />
                         {errors.dailypayment && (
                        <p className='text-red-500 text-sm'>{String(errors.dailypayment.message)}</p>
                          )
                          }
                      </div>
                        <div className="form-group mb-3">
                          <label htmlFor="simple-select2">Ait olduğu departman : </label>
                          <select className="form-control" id="simple-select2"
                          {...register("departmentId",{required: "Departman bilgisi gereklidir."})}
                          >
                            <optgroup label="">
                              {departments.map((dep,index)=>(
                                <option key={index} value={`${dep.id}`}>{dep.name}</option>
                              ))}  
                              
                
                            </optgroup>
                          
                          </select>
                           {errors.departmentId && (
                        <p className='text-red-500 text-sm'>{String(errors.departmentId.message)}</p>
                          )
                          }
                          
                     </div>

                      <div className="form-group mb-3">
                          <label htmlFor="simple-select2">Sorumlu Eleman : </label>
                          <select className="form-control" id="simple-select2"
                          {...register("responsibleUserId",{required: "Sorumlu kullanıcı gereklidirr."})}
                          >
                            <optgroup label="">
                                {users.map((us,index)=>(
                                <option key={index} value={`${us.id}`}>{us.name}</option>
                              ))}  
                
                            </optgroup>
                          
                          </select>

                           {errors.responsibleUserId && (
                        <p className='text-red-500 text-sm'>{String(errors.responsibleUserId.message)}</p>
                          )
                          }

                          
                     </div>

                      
                      
                      <div className="form-group mb-3">
                        <label htmlFor="example-disable">İlan bitiş tarihi : </label>
                        <input className="form-control" id="example-date" type="date" 
                        {...register("expiredate",{required: "Bitiş tarihi bilgisi gereklidir."})}
                        />
                         {errors.expiredate && (
                        <p className='text-red-500 text-sm'>{String(errors.expiredate.message)}</p>
                          )
                          }
                      </div>
                     
                    </div>
                  </div>
                  <div className="row">
                    <div className='col-md-12'>
                        <div className="form-group mb-3">
                        <label htmlFor="example-palaceholder">İş gereksinimleri(araya virgül koyarak) :</label>
                        <textarea className="form-control" id="custom-phone" placeholder="..." 
                        {...register("jobrequirements",{required: "İş gereksinimleri bilgisi gereklidir."})}
                        />

                        {errors.jobrequirements && (
                        <p className='text-red-500 text-sm'>{String(errors.jobrequirements.message)}</p>
                          )
                          }
                      </div>

                       <div className="form-group mb-3">
                        <label htmlFor="example-palaceholder">İlan Açıklaması :</label>
                        <textarea className="form-control" id="custom-phone" placeholder="..."
                        {...register("jobnotes",{required: "İş gereksinimleri bilgisi gereklidir."})}
                        />
                        {errors.jobnotes && (
                        <p className='text-red-500 text-sm'>{String(errors.jobnotes.message)}</p>
                          )
                          }
                      </div>
                    </div>
                  </div>
                </div>
              </div> 
            </div> 

          </div> 

               <div className="row mb-4">
                <div className="col-md-12">
                  
                <button className="col-md-12 btn btn-primary" type="submit">Ekle</button>
                </div>
               </div>


         </form>
        )}

        {send && (
          <div>
            {success ? (
              <p>İş ilanı başarıyla eklendi.</p>
            ) : (
              <p>İş ilanı eklenemedi.</p>
            )
          }

          </div>
        )}
       
        </div>
  )
}

export default Page
