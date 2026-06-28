import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import React from 'react'


const useLogout = () => {

    const router = useRouter()

    return useMutation({
      mutationFn: async () => {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/auth/user-logout`,{},{withCredentials:true})
          return response.data
      },
      onSuccess:(data)=>{
          router.push("/");
  
      },
      onError: (error:AxiosError) => {
          const errorMsg = (error.response?.data as {message?:string})?.message || "Invalid credentials"
          console.log(errorMsg)
      }
      
    })

}

export default useLogout
