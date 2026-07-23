"use client"
import { getDepartment } from '@/app/lists/department'
import axiosInstance from '@/app/utils/axiosInstance'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

const Page =  () => {

     const params = useParams<{ id: string }>();

     const id = params.id;

    const [serverError,setServerError] = useState<string | null>(null)
    const [success,setSuccess] = useState(false)
    const [send,setSend] = useState(false)

      type DepartmentFormData = {
      id:string;
      name:string;
     };
   
       const {reset:reset,register:register,handleSubmit:handleSubmit,getValues:getValue,setValue:setValue,formState:{errors:errors}} = useForm<DepartmentFormData>({
        mode:"onChange",
        defaultValues:{
          id:"",
          name:""
        }
       });


       const onSubmit = (data:DepartmentFormData) => {
      updateDepartmentMutation.mutate(data)
    };


     const updateDepartmentMutation = useMutation({
      mutationFn: async (data:DepartmentFormData) => {

        const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/job/update-department`,data)
        setSend(true)
        return response.data
          
      },
      onSuccess:(data : unknown)=>{
          setServerError(null);
          setSuccess(true)
          reset()
      },
      onError: (error:AxiosError) => {
          const errorMsg = (error.response?.data as {message?:string})?.message || "Departman formu gönderilemedi"
          console.log(errorMsg)
          setServerError(errorMsg);
          setSuccess(false)
      }
      
    })


        
      useEffect(() => {
      const fetchData = async () => {
        try {
          if (id !== undefined) {
            try {
            const user = await getDepartment(id.toString());
    
            if (user) {
             
                reset({
                  id:user.id,
                  name: user.name,
                  
                });
    
              }
              
            }catch(error){
              console.log(error)
            }
            
          }
        
        } catch (error) {
          console.error(error);
        }
      
      };
    
      fetchData();
    
    
      
      
    }, []);

 
  return (
   <div>
          <div className="row justify-content-center">
           {send ? ( success ? (
              <p>Departman başarıyla eklendi.</p>
            ) : (
              <p>Departman eklenemedi.</p>
            )):("")
          }
            <div className="col-12">
              <h2 className="page-title">{params.id} id li departman güncelleme</h2>
              <p className="text-muted"></p>
              <div className="card shadow mb-4">
                <div className="card-header">
                  <strong className="card-title"></strong>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group mb-3">
                        <label htmlFor="simpleinput">Departman İsmi</label>
                        <input type="text" id="simpleinput" className="form-control" {...register("name",{required: "Departman ismi gereklidir..."})} />
                      </div>
                     
                    </div> 
                    
                  </div>
                   <div className="row mb-4">
                <div className="col-md-12">
                    
                        <button className="col-md-12 btn btn-primary" type="submit">Güncelle</button>
                </div>
               </div>
               </form>
                </div>
              </div> 
            
            </div> 

          </div> 

          
             

        </div>
  )
}

export default Page
