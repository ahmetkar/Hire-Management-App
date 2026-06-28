"use client";

import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';

const page = () => {

  type FormData = {
      email:string;
      password:string;
  };


  const [passwordVisible,setPasswordVisible] = useState(false)
  const [serverError,setServerError] = useState<string | null>(null)
  const [rememberMe,setRememberMe] = useState(false)

    const router = useRouter()

    
   const {register,handleSubmit,formState:{errors}} = useForm<FormData>();

  const onSubmit = (data:FormData) => {
    loginMutation.mutate(data)
  };

  const loginMutation = useMutation({
    mutationFn: async (data:FormData) => {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/auth/user-login`,data,{withCredentials:true})
        return response.data
    },
    onSuccess:(data)=>{
        setServerError(null);
        router.push("/application/");

    },
    onError: (error:AxiosError) => {
        const errorMsg = (error.response?.data as {message?:string})?.message || "Invalid credentials"
        setServerError(errorMsg);
    }
    
  })

  
 
 

  return (
    <div>
      <div className="row align-items-center h-100">
        <form onSubmit={handleSubmit(onSubmit)} className="col-lg-3 col-md-4 col-10 mx-auto text-center">
          <a className="navbar-brand mx-auto mt-2 flex-fill text-center" href="./index.html">
            <svg version="1.1" id="logo" className="navbar-brand-img brand-md" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 120 120" xmlSpace="preserve">
              <g>
                <polygon className="st0" points="78,105 15,105 24,87 87,87 	" />
                <polygon className="st0" points="96,69 33,69 42,51 105,51 	" />
                <polygon className="st0" points="78,33 15,33 24,15 87,15 	" />
              </g>
            </svg>
          </a>
          <h1 className="h6 mb-3">Sign in</h1>
          <div className="form-group">
            <label htmlFor="inputEmail" className="sr-only">Email address</label>
            <input type="email" id="inputEmail" className="form-control form-control-lg" placeholder="Email address" required autoFocus={false}
            {...register("email",{required: "Email gereklidir.",pattern : {
                        value:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                        message:"Geçersiz email"
                    }})}
            />
             {errors.email && (
                        <p className='text-red-500 text-sm'>{String(errors.email.message)}</p>
                    )
                    }
          </div>
          <div className="form-group">
            <label htmlFor="inputPassword" className="sr-only">Password</label>
            <input type="password" id="inputPassword" className="form-control form-control-lg" placeholder="Password" required
            {...register("password",{required: "Şifre gereklidir.",minLength : {
                        value:6,
                        message:"Geçersiz şifre"
                    }})}
            />
              {errors.password && (
                        <p className='text-red-500 text-sm'>{String(errors.password.message)}</p>
                    )
                    }
          </div>
          <div className="checkbox mb-3">
            <label>
              <input onChange={()=>setRememberMe(!rememberMe)} type="checkbox" value="remember-me" /> Beni Hatırla </label>
          </div>
          <button className="btn btn-lg btn-primary btn-block" type="submit">Giriş Yap</button>
          <p className="mt-5 mb-3 text-muted">© 2020</p>
        </form>
      </div>
    </div>
  )
}

export default page
