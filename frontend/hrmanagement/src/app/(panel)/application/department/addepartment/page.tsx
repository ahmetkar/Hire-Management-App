import axiosInstance from '@/app/utils/axiosInstance';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';

const Page = () => {

       const [serverError,setServerError] = useState<string | null>(null)
       const [send,setSend] = useState(false)
       const [success,setSuccess] = useState(false)

      type DepartmentFormData = {
      name:string;
     };
   
       const {reset:reset,register:register,handleSubmit:handleSubmit,getValues:getValue,setValue:setValue,formState:{errors:errors}} = useForm<DepartmentFormData>({
        mode:"onChange"
       });


       const onSubmit = (data:DepartmentFormData) => {
      addDepartmentMutation.mutate(data)
    };


     const addDepartmentMutation = useMutation({
      mutationFn: async (data:DepartmentFormData) => {

        const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/job/create-department`,data)
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
              <h2 className="page-title">Departman Ekleme</h2>
              <p className="text-muted">İhtiyaca göre açıklama gelecek.</p>
              <div className="card shadow mb-4">
                <div className="card-header">
                  <strong className="card-title">Form controls</strong>
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
                    
                        <button className="col-md-12 btn btn-primary" type="submit">Ekle</button>
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
