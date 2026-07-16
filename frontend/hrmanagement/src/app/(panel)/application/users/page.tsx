"use client";

import { getUsers, searchUsers, UserResponse} from '@/app/lists/datas/users';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Pagination from '../utils/pagination';
import axiosInstance from '@/app/utils/axiosInstance';
import Modal from '@/app/components/Modal';
import { ArrowDown, ArrowUp } from 'lucide-react';

const Page = () => {

  const defaultLimit = 4
  const [activeId,setActiveId] = useState("")

  const [showDeleteModal,setShowDeleteModal] = useState(false)
  const [showSuccessModal,setShowSuccessModal] = useState(false)
  const [showFailureModal,setShowFailureModal] = useState(false)
  const [successTitle,setSuccessTitle] = useState("")
  const [failureTitle,setFailureTitle] = useState("")
  const [failureDesc,setFailureDesc] = useState("")
  const [successDesc,setSuccessDesc] = useState("")
   const [detailForId,setDetailForId] = useState("")
  
  
       const [users,setUsers] = useState<UserResponse>({
          data:[],
          total: 0,
          page: 1,
          limit: defaultLimit,
          totalPages: 0,
       });
       const params =  useSearchParams()
       const router = useRouter()
    
       const page = Number(params.get("page")) || 1
       const limit = Number(params.get("limit") || defaultLimit)
       const searchStr = params.get("search")
  
     
    
       useEffect(() => {
          if(searchStr != null){
          searchUsers(searchStr,page,limit)
            .then((data) => setUsers(data))
            .catch((error) => console.error(error));
          }else {
          getUsers(page,limit)
            .then((data) => setUsers(data))
            .catch((error) => console.error(error));  
          } 
         
        }, [page,limit,searchStr]);



        const deleteUser = async (id:string)=>{
            const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/auth/user-delete/${id}`)
            if(response.status==201){
                setSuccessTitle("Başarıyla silindi")
                setSuccessDesc("İstediğiniz kullanıcı silindi.")
                setShowSuccessModal(true)
            }else {
                setFailureTitle("Başarıyla silindi")
                setFailureDesc("İstediğiniz kullanıcı silindi.")
                setShowFailureModal(true)
            }
        }

  
  


  return (
    <div>
        <Modal show={showSuccessModal} title={successTitle} message={successDesc}
                                    confirmText='' cancelText='İptal' setConfirm={false} onConfirm={()=>{}} onCancel={()=>setShowSuccessModal(false)} />
        <Modal show={showFailureModal} title={failureTitle} message={failureDesc}
                                    confirmText='' cancelText='İptal' setConfirm={false} onConfirm={()=>{}} onCancel={()=>setShowFailureModal(false)} />
       
          <div className="row justify-content-center">
            <div className="col-12">
              <h2 className="mb-2 page-title">Kullanıcılar</h2>
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
                            <th>Email</th>
                            <th>Departman</th>
                            <th>Rol</th>
                            <th>Kayıt tarihi</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(users.data!=undefined ? users.data.map((u)=>(
                          <React.Fragment key={u!.id}>
                          
                          
                           <tr>
                            <td style={{borderBottom:(u!.staffInfoOne!=undefined) ? "none" : undefined,}}>
                                 <Modal show={showDeleteModal} title={"Silmek istediğinize emin misiniz ?"} message={"Bu kişiyi silmek üzeresiniz."}
                                    confirmText='Tamam' cancelText='İptal' setConfirm={true} onConfirm={()=>{deleteUser(u!.id)}} onCancel={()=>setShowDeleteModal(false)} />
                                {(u!.staffInfoOne!=undefined) ? (
                                  <div>
                                            <a onClick={(e)=>{
                                            e.preventDefault()
                                            setDetailForId(u!.id == detailForId ? "" : u!.id)}}>
                                                {detailForId==u!.id ? (
                                                <ArrowUp  />
                                                ) : (
                                                <ArrowDown />
                                                )}
                                                </a>
                                        </div>
                                ) : ("")}
                                
                            </td>
                            <td><small className="mb-0 text-muted" onClick={(e)=>{
                                e.preventDefault()
                                setActiveId(activeId==u!.id ? u!.id.substring(0,5) : u!.id)
                                }}>{activeId == u!.id ? u!.id: u!.id.substring(0,5)}</small></td>
                            <td>{u!.name}</td>
                            <td>{u!.email}</td>
                            <td>{u!.departmentId}</td>
                            <td>{u!.role}</td>
                           <td>{u!.signupdate}</td>
                            
                            <td><button className="btn btn-sm dropdown-toggle more-horizontal" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span className="text-muted sr-only">Action</span>
                              </button>
                              <div className="dropdown-menu dropdown-menu-right">
                                <a className="dropdown-item" href={u!.staffInfoOne!=undefined ?  `/application/users/view/${u!.staffInfoOne.id}` : `/application/users/view/${u!.id}`}>Güncelle</a>
                                <a onClick={()=>setShowDeleteModal(true)} className="dropdown-item" href='#'>Sil</a>
                              </div>
                            </td>
                          </tr>
                          {(u!.staffInfoOne!=undefined) ? (
                            <tr style={{marginTop:0}}>
                            <td style={{borderTop:(u!.staffInfoOne!=undefined) ? "none" : undefined,paddingTop:0,paddingBottom:0,paddingLeft:5}} colSpan={detailForId == u!.id ? 8 : 1}>{detailForId == u!.id ? (<>
                                      <p className='mb-0'>
                                        <small className="mb-0">
                                        <strong>Adres :</strong> {u!.staffInfoOne.address} - {u!.staffInfoOne.county} - {u!.staffInfoOne.city} - {u!.staffInfoOne.postcode}
                                      </small>
                                        </p>

                                        <p className='mb-0'>
                                        <small className="mb-0">
                                        <strong>Eğitim Bilgileri :</strong> {u!.staffInfoOne.university} - {u!.staffInfoOne.unidepartment}  / {u!.staffInfoOne.graduatedate.split("T")[0].toString()}
                                      </small>
                                        </p>

                                        
                                        <p className='mb-0'>
                                        <small className="mb-0">
                                        <strong>Yetenekler :</strong> {u!.staffInfoOne.abilities}
                                      </small>
                                        </p>

                                        <p className='mb-0'>
                                        <small className="mb-0">
                                        <strong>Doğum tarihi :</strong> {u!.staffInfoOne.birthdate}
                                      </small>
                                        </p>

                                        <p className='mb-0'>
                                        <small className="mb-0">
                                        <strong>Biyografi :</strong> {u!.staffInfoOne.selfbio}
                                      </small>
                                        </p>


                                        <p className='mb-0'>
                                        <small className="mb-0">
                                        <strong>Linkler :</strong> {u!.staffInfoOne.githublink} | {u!.staffInfoOne.linkedinlink}
                                      </small>
                                        </p>

                                        </>
                                    ) : ("")}</td>
                          </tr>
                          ) : ("")}
                          
                          </React.Fragment>
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

export default Page
