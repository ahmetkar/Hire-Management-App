"use client"

import { useSearchParams,useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Pagination from '../../utils/pagination';
import {ArrowDown, ArrowUp, Router} from "lucide-react"
import Modal from '@/app/components/Modal';
import axiosInstance from '@/app/utils/axiosInstance';
import { getAllStaff, StaffResponse } from '@/app/lists/datas/users';



const Page = () => {

    const defaultLimit = 5
    const [activeId,setActiveId] = useState("")
    const [detailForId,setDetailForId] = useState("")

    const [showDeleteModal,setShowDeleteModal] = useState(false)
    const [showSuccessModal,setShowSuccessModal] = useState(false)
    const [showFailureModal,setShowFailureModal] = useState(false)
    const [successTitle,setSuccessTitle] = useState("")
    const [failureTitle,setFailureTitle] = useState("")
    const [failureDesc,setFailureDesc] = useState("")
    const [successDesc,setSuccessDesc] = useState("")


     const [staffResponse, setStaffResponse] = useState<StaffResponse>({
        data: [],
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
        /*searchJobApps(searchStr,page,limit)
          .then((data) => setStaffUsersResponse(data))
          .catch((error) => console.error(error));  */
        }else {
        getAllStaff(page,limit)
          .then((data) => setStaffResponse(data))
          .catch((error) => console.error(error));  
        } 
       
      }, [page,limit,searchStr]);


      const setLimit = (e:React.ChangeEvent<HTMLSelectElement>) => {
        const l  = e.target.value
        const searchParams = new URLSearchParams(params.toString())
      
        searchParams.set("limit",l.toString())
        searchParams.set("page","1")
      
        if(searchStr != null){
        searchParams.set("search",searchStr)
        }

        router.push(`?${searchParams.toString()}`)
      }

      


      const doSearch = (e:React.ChangeEvent<HTMLInputElement>)=>{
        const searchstr  = e.target.value
        const searchParams = new URLSearchParams(params.toString())
      
        searchParams.set("limit",limit.toString())
        searchParams.set("page","1")
      
        searchParams.set("search",searchstr)
        
        router.push(`?${searchParams.toString()}`)
        
      }

      const deleteUserStaff = async (id:string)=>{
            const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/auth/staff-user-delete/${id}`)
            if(response.status==201){
                setSuccessTitle("Başarıyla silindi")
                setSuccessDesc("İstediğiniz personel silindi.")
                setShowSuccessModal(true)
            }else {
                setFailureTitle("Başarıyla silindi")
                setFailureDesc("İstediğiniz personel silindi.")
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
              <div className="row">
               
                <div className="col-md-12 my-4">
                  <h2 className="h4 mb-1">Personeller</h2>
                  <p className="mb-3"></p>
                  <div className="card shadow">
                    <div className="card-body">
                      <div className="toolbar">
                        <form className="form">
                          <div className="form-row">
                            <div className="form-group col-auto mr-auto">
                              <label className="my-1 mr-2 sr-only" htmlFor="inlineFormCustomSelectPref1">Show</label>
                              <select value={limit} onChange={(e)=>setLimit(e)} className="custom-select mr-sm-2" id="inlineFormCustomSelectPref1">
                                <option value={1}>1</option>
                                <option  value={4}>4</option>
                                <option  value={5}>5</option>
                                <option value={8}>8</option>
                              </select>
                            </div>
                             
                            <div className="form-group col-auto">
                              <label htmlFor="search" className="sr-only">Search</label>
                              <input onChange={(e)=>doSearch(e)} type="text" className="form-control" id="search1" placeholder={"isim,soyisim veya başka detay .."} />
                            </div>
                          </div>
                        </form>
                      </div>
                     
                      <table className="table table-borderless table-hover">
                        <thead>
                          <tr>
                            <td>
                              <div className="custom-control custom-checkbox">
                                
                                <ArrowDown />
                              </div>
                            </td>
                            <th>ID</th>
                            <th>İsim Soyisim</th>
                            <th>Email</th>
                            <th>Kayıt tarihi</th>
                            <th>Şehir</th>
                            <th>Ülke</th>
                            <th>Pozisyon</th>
                            <th>Aksiyonlar</th>
                          </tr>
                        </thead>
                        <tbody>
                          {staffResponse.data.map((uap)=>(

                            <React.Fragment key={uap.id}>
                            
                            <tr>
                                 
                            <td>
                                <Modal show={showDeleteModal} title={"Silmek istediğinize emin misiniz ?"} message={"Bu kişiyi silmek üzeresiniz."}
                                                                    confirmText='Tamam' cancelText='İptal' setConfirm={true} onConfirm={()=>{deleteUserStaff(uap.id)}} onCancel={()=>setShowDeleteModal(false)} />
                            
                                <div className="custom-control custom-checkbox">
                                    <a onClick={(e)=>{
                                    e.preventDefault()
                                    setDetailForId(uap.id == detailForId ? "" : uap.id)}}>
                                        {detailForId==uap.id ? (
                                        <ArrowUp  />
                                        ) : (
                                        <ArrowDown />
                                        )}
                                        </a>
                                </div>
                            </td>
                          
                             <td>
                                {/* 
                                    <div className="avatar avatar-md">
                                    <img src="./assets/avatars/face-1.jpg" alt="..." className="avatar-img rounded-circle">
                                </div>
                                    */}
                                <small className="mb-0 text-muted" onClick={(e)=>{
                                e.preventDefault()
                                setActiveId(activeId==uap.id ? uap.id.substring(0,5) : uap.id)
                                }}>{activeId == uap.id ? uap.id: uap.id.substring(0,5)}</small>
                            </td>
                            <td>
                              <p className="mb-0 text-muted"><strong>{uap.name}</strong></p>
                            </td>
                            <td>
                              {uap.email}
                            </td>
                            <td>
                              <p className="mb-0 text-muted">
                                    {uap.signupdate}
                               </p>
                            </td> 
                            <td><small className="text-muted">{uap.city}</small></td>
                            <td><small className="text-muted">{uap.country}</small></td>
                            <td className="text-muted">{uap.jobId}</td>
                            
                            <td>
                                <button className="btn btn-sm dropdown-toggle more-horizontal" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span className="text-muted sr-only">Aksiyonlar</span>
                              </button>
                              <div className="dropdown-menu dropdown-menu-right">
                            
                                <a className="dropdown-item" href={`/application/users/view/${uap.id}`}>Güncelle</a>
                                <a onClick={(e)=>setShowDeleteModal(true)} className="dropdown-item">Sil</a>
                                
                              </div>
                            </td>
                            </tr>
                            <tr>
                            <td></td>
                            <td colSpan={detailForId == uap.id ? 8 : 1}>{detailForId == uap.id ? (<>
                              <p className='mb-0'>
                                <small className="mb-0">
                                <strong>Adres :</strong> {uap.address} - {uap.county} - {uap.city} - {uap.postcode}
                              </small>
                                </p>

                                <p className='mb-0'>
                                <small className="mb-0">
                                <strong>Eğitim Bilgileri :</strong> {uap.university} - {uap.unidepartment}  / {uap.graduatedate.split("T")[0].toString()}
                              </small>
                                </p>

                                
                                <p className='mb-0'>
                                <small className="mb-0">
                                <strong>Yetenekler :</strong> {uap.abilities}
                              </small>
                                </p>

                                 <p className='mb-0'>
                                <small className="mb-0">
                                <strong>Doğum tarihi :</strong> {uap.birthdate}
                              </small>
                                </p>

                                 <p className='mb-0'>
                                <small className="mb-0">
                                <strong>Biyografi :</strong> {uap.selfbio}
                              </small>
                                </p>


                                 <p className='mb-0'>
                                <small className="mb-0">
                                <strong>Linkler :</strong> {uap.githublink} | {uap.linkedinlink}
                              </small>
                                </p>

                                </>
                            ) : ("")}</td>
                            </tr>
                          </React.Fragment>
                          
                          ))}
                        </tbody>
                      </table>
                         <Pagination pname="page" currentPage={staffResponse.page} totalPages={staffResponse.totalPages} ></Pagination>
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
