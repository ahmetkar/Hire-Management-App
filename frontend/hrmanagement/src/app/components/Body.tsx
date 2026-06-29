"use client";

import React from 'react'
import { useSelectedLayoutSegments } from "next/navigation";
import Providers from './providers';

const Body = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
     const segments = useSelectedLayoutSegments();
     let activeRoute = segments.join("/")
    if(activeRoute.includes("(site)")){
        return (
     <body className="horizontal light" suppressHydrationWarning>
        <Providers>
        {children}
        </Providers>
        </body>
    )
    }else {
    return (
     
     <body className="vertical light" suppressHydrationWarning>
      <Providers>
        {children}

        </Providers>
        
        </body>
    )
    }
     
}

export default Body
