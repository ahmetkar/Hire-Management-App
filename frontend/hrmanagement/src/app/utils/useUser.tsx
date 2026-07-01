import {useQuery} from "@tanstack/react-query"
import axiosInstance from "./axiosInstance"


const fetchUser =  async () => {
    const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_SERVER_URI}/auth/get-logged-user`)
    return response.data;
}

const useUser = ()=>{
      const {   
        data:user,
        isLoading,
        isError,
        refetch
      } = useQuery({
            queryKey:["user"],
            queryFn: fetchUser,
            staleTime:1000*60*5,
            retry:1
      });  

      return {user,isLoading,isError,refetch};
}

export default useUser;