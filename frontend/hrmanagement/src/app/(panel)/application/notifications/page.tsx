"use client"
import { getNotifications, NotificationResponse } from '@/app/lists/notifications';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Pagination from '../utils/pagination';

const Page = () => {
       const [notifications,setNotifications] = useState<NotificationResponse>({
                data:[],
                total: 0,
                page: 1,
                limit: 5,
                totalPages: 0,
             });

                const params =  useSearchParams()
                
                 
                const page = Number(params.get("page")) || 1
                const limit = Number(params.get("limit") || 5)
                  
               
                  
    
         useEffect(() => {
                
                getNotifications(page,limit)
                  .then((data) => setNotifications(data))
                  .catch((error) => console.error(error));  
                
              },[page,limit]);
      
      
    
  return (
    <div className="row justify-content-center">
      
        <div className="col-md-12">
                  <div className="card shadow eq-card">
                    <div className="card-header">
                      <strong className="card-title">Bildirimler</strong>
                      <a className="float-right small text-muted" href="#!">View all</a>
                    </div>
                    <div className="card-body">
                      <table className="table table-hover table-borderless table-striped mt-n3 mb-n1">
                        <thead>
                          <tr>
                          
                            <th>Başlık</th>
                            <th>Açıklama</th>
                            <th>Tarih</th>
                        
                          </tr>
                        </thead>
                        <tbody>
                          {notifications.data.map((ntf)=>(
                            <tr key={ntf.desc}>
                            <td><a href={ntf.href!="" ? `/application/jobmanagement/detail/${ntf.href}` : "#"}>{ntf.title}</a></td>
                            <td><span className="small text-muted">{ntf.desc}</span></td>
                            <td>{ntf.date.toString().split("T")[0]}</td>
                          </tr>
                          ))}
                          
                         
                        </tbody>
                      </table>
                    </div>
                  </div> 
                   <Pagination currentPage={notifications.page} totalPages={notifications.totalPages} ></Pagination>
                </div> 
     
    </div>
  )
}

export default Page
