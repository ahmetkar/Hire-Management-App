"use client";

import React from 'react'
import { useSelectedLayoutSegments } from "next/navigation";

const Body = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
     const segments = useSelectedLayoutSegments();
     let activeRoute = segments.join("/")
    if(activeRoute == "(site)" || activeRoute == "(site)/applyjob"){
        return (
     <body className="horizontal light" suppressHydrationWarning>
     
        {children}</body>
    )
    }else {
    return (
     
     <body className="vertical light" suppressHydrationWarning>
      
        {children}</body>
    )
    }
     
}

export default Body
