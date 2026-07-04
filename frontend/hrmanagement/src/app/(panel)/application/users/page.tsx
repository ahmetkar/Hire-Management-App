"use client";

import { AllResponse, getUsers, searchUsers, UserResponse,StaffResponse,StaffUserResponse, getAll } from '@/app/lists/datas/users';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Pagination from '../utils/pagination';

const page = () => {


  
  const defaultLimit = 4
  const [activeId,setActiveId] = useState("")
  const [detailForId,setDetailForId] = useState("")
  const [showDeleteModal,setShowDeleteModal] = useState(false)
  const [showSuccessModal,setShowSuccessModal] = useState(false)
  const [showFailureModal,setShowFailureModal] = useState(false)
  const [successTitle,setSuccessTitle] = useState("")
  const [failureTitle,setFailureTitle] = useState("")
  const [failureDesc,setFailureDesc] = useState("")
  const [successDesc,setSuccessDesc] = useState("")
  
  
       const [users,setUsers] = useState<AllResponse>({
          staffResponse:undefined,
          userResponse:undefined,
          staffuserResponse:undefined,
          allresponse:[],
          total: 0,
          page: 1,
          limit: 4,
          totalPages: 0,
       });
       const params =  useSearchParams()
       const router = useRouter()
    
       const page = Number(params.get("page")) || 1
       const limit = Number(params.get("limit") || defaultLimit)
       const searchStr = params.get("search")
  
     
    
       useEffect(() => {
          if(searchStr != null){
          /*searchUsers(searchStr,page,limit)
            .then((data) => setUsers(data))
            .catch((error) => console.error(error)); */ 
          }else {
          getAll(page,limit)
            .then((data) => setUsers(data))
            .catch((error) => console.error(error));  
          } 
         
        }, [page,limit,searchStr]);
  
  
        const setLimit = (e:React.ChangeEvent<HTMLSelectElement>) => {
          const l  = e.target.value
          const searchParams = new URLSearchParams(params.toString())
        
          searchParams.set("limit",l.toString())
          searchParams.set("page","1")
          //searchParams.set("type",type)
          if(searchStr != null){
          searchParams.set("search",searchStr)
          }
  
          router.push(`?${searchParams.toString()}`)
        }
  
        /*const setNType = (e:React.ChangeEvent<HTMLSelectElement>) => {
          
          const l  = e.target.value
          setType(l)
          const searchParams = new URLSearchParams(params.toString())
        
          searchParams.set("limit",limit.toString())
          searchParams.set("page","1")
          searchParams.set("type",l.toString()
          )
          if(searchStr != null){
          searchParams.set("search",searchStr)
          }
  
          router.push(`?${searchParams.toString()}`)
        }*/
  
  
        const doSearch = (e:React.ChangeEvent<HTMLInputElement>)=>{
          const searchstr  = e.target.value
          const searchParams = new URLSearchParams(params.toString())
        
          searchParams.set("limit",limit.toString())
          searchParams.set("page","1")
         // searchParams.set("type",type)
          searchParams.set("search",searchstr)
          
          router.push(`?${searchParams.toString()}`)
          
        }


  


  return (
    <div>
          <div className="row justify-content-center">
            <div className="col-12">
              <h2 className="mb-2 page-title">Personeller ve Kullanıcılar</h2>
              <p className="card-text"> </p>
              <div className="row my-4">
              
                <div className="col-md-12">
                  <div className="card shadow">
                    <div className="card-body">
               
                      <table className="table datatables" id="dataTable-1">
                        <thead>
                          <tr>
                            <th></th>
                            <th>#</th>
                            <th>İsim ve Soyisim</th>
                            <th>Departman</th>
                            <th>Email</th>
                            <th>Kayıt tarihi</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(users.allresponse!=undefined ? users.allresponse.map((u)=>(
                           <tr key={u.email}>
                            <td>
                              <div className="custom-control custom-checkbox">
                                <input type="checkbox" className="custom-control-input" />
                                <label className="custom-control-label"></label>
                              </div>
                            </td>
                            <td>{}</td>
                            <td>{u.name}</td>
                            <td>{u.departmentId}</td>
                            <td>{u.email}</td>
                           <td>{u.signupdate}</td>
                            
                            <td><button className="btn btn-sm dropdown-toggle more-horizontal" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span className="text-muted sr-only">Action</span>
                              </button>
                              <div className="dropdown-menu dropdown-menu-right">
                                <a className="dropdown-item" href="#">Güncelle</a>
                                <a className="dropdown-item" href="#">Sil</a>
                              </div>
                            </td>
                          </tr>
                          )) : (<div></div>))}
                         
                         
                          
                        </tbody>
                      </table>
                        <Pagination currentPage={users.page} totalPages={users.totalPages} ></Pagination>

                    </div>
                  </div>
                </div>
              </div> 
            </div> 
          </div> 
        </div>
  )
}

export default page
