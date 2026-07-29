"use client"

import Topbar from "../../components/Topbar";
import Aside from "../../components/Aside";
import { useAuth } from "../../components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

   const { loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (<div>
    <div className="wrapper">
      
      <Topbar></Topbar>
      
      <Aside></Aside>
      
      <main role="main" className="main-content">
       <div className="container-fluid">
          <p>Giriş yapılıyor...</p>
       </div>
       
      </main> 
    </div> 
   
  </div>)
  }

  if (!isAuthenticated) {
    return null;
  }
  return (
   
    <>
  
  <div>
    <div className="wrapper">
      
      <Topbar></Topbar>
      
      <Aside></Aside>
      
      <main role="main" className="main-content">
       <div className="container-fluid">
        {children}
       </div>
       
      </main> 
    </div> 
    
 


   
  </div>
 
</>
  );
}
