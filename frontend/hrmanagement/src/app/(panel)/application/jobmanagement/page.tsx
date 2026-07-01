"use client"
import { searchJobApps,getJobApps, JobAppsResponse } from '@/app/lists/jobapplications';
import { useSearchParams,useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Pagination from '../utils/pagination';
import {ArrowDown, ArrowUp, Router} from "lucide-react"


const page = () => {

const defaultLimit = 1
const [activeId,setActiveId] = useState("")
const [detailForId,setDetailForId] = useState("")
const [type,setType] = useState("new")

     const [jobAppResponse, setJobAppResponse] = useState<JobAppsResponse>({
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
     });
     const params =  useSearchParams()
     const router = useRouter()
  
     const page = Number(params.get("page")) || 1
     const limit = Number(params.get("limit") || defaultLimit)
     const searchStr = params.get("search")

   
  
     useEffect(() => {
        if(searchStr != null){
        searchJobApps(searchStr,page,limit,type)
          .then((data) => setJobAppResponse(data))
          .catch((error) => console.error(error));  
        }else {
        getJobApps(page,limit,type)
          .then((data) => setJobAppResponse(data))
          .catch((error) => console.error(error));  
        } 
       
      }, [page,limit,type,searchStr]);


      const setLimit = (e:React.ChangeEvent<HTMLSelectElement>) => {
        const l  = e.target.value
        const searchParams = new URLSearchParams(params.toString())
      
        searchParams.set("limit",l.toString())
        searchParams.set("page","1")
        searchParams.set("type",type)
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
        searchParams.set("type",type)
        searchParams.set("search",searchstr)
        
        router.push(`?${searchParams.toString()}`)
        
      }
 
  return (
    <div>
          <div className="row justify-content-center">
            <div className="col-12">
              <div className="row">
               
                <div className="col-md-12 my-4">
                  <h2 className="h4 mb-1">İş Başvuruları</h2>
                  <p className="mb-3">Firmanıza yapılan iş başvuruları aşağıda görüntülenmektedir.</p>
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
                             <div className="form-group col-auto ml-3">
                                <label className="my-1 mr-2 sr-only" htmlFor="inlineFormCustomSelectPref">Status</label>
                                <select className="custom-select my-1 mr-sm-2" id="inlineFormCustomSelectPref">
                                  <option defaultValue={""}>Choose...</option>
                                  <option onClick={()=>setType("new")} value="1">Yeni Başvuru</option>
                                  <option onClick={()=>setType("waiting")} value="2">Yönetici Onayı Bekliyor</option>
                                  <option onClick={()=>setType("approved")} value="3">Onaylanan</option>
                                  <option onClick={()=>setType("disapproved")} value="3">Reddedilen</option>
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
                            <th>İsim-Soyisim/Mezuniyet</th>
                            <th>İlan İd</th>
                            <th>İletişim Bilgileri</th>
                            <th>Ülke</th>
                            <th>Başvuru Tarihi</th>
                            <th>Durum</th>
                            <th>Aksiyonlar</th>
                          </tr>
                        </thead>
                        <tbody>
                          {jobAppResponse.data.map((uap)=>(
                            
                            <React.Fragment key={uap.id}>
                            <tr>
                            <td>
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
                            }}>{activeId == uap.id ? uap.id: uap.id.substring(0,5)}</small></td>
                            <td>
                              <p className="mb-0 text-muted"><strong>{uap.name}</strong></p>
                              <small className="mb-0 text-muted">{uap.graduatedate.split("T")[0].toString()}</small>
                            </td>
                            <td>
                              <p className="mb-0 text-muted">

                                <small className="mb-0 text-muted">İlan Id : {uap.job.id}</small>
                              </p>
                              
                               <p className="mb-0 text-muted">
                                <small className="mb-0 text-muted">İlan Başlık : {uap.job.jobtitle}</small>
                               </p>
                            </td>
                            <td>
                              <p className="mb-0 text-muted">
                              <small className="mb-0 text-muted">
                                 Email : {uap.email}
                              </small>
                               </p>

                                <p className="mb-0 text-muted">
                                <small className="text-muted">
                                 Telefon nu : {uap.phone_number}
                              </small>
                               </p>
                              
                            
                            </td> 
                            <td><small className="text-muted">{uap.country}</small></td>
                            <td className="text-muted">{uap.appdate.split("T")[0].toString()}</td>
                            <td>{uap.managerapproved ? "Onaylı" : uap.staffapproved ? "Yönetici Onayı Bekliyor" : "Onay Bekliyor"}</td>
                            <td><button className="btn btn-sm dropdown-toggle more-horizontal" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span className="text-muted sr-only">Aksiyonlar</span>
                              </button>
                              <div className="dropdown-menu dropdown-menu-right">
                            
                                <a className="dropdown-item" href={`/application/jobmanagement/detail/${uap.id}`}>İncele</a>
                                <a className="dropdown-item">Direkt Onayla</a>
                                <a className="dropdown-item">Direkt Reddet</a>
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
                                <strong>Şartları onayladı mı ?  :</strong> {uap.agreeterms ? "Evet" : "Hayır"}
                              </small>
                                </p>

                                 <p className='mb-0'>
                                <small className="mb-0">
                                <strong>Linkler :</strong> {uap.githublink} | {uap.linkedinlink}
                              </small>
                                </p>

                                <p className='mb-0'>
                                <small className="mb-0">
                                <strong>AI Değerlendirmesi :</strong> 
                                Deneme açıklama
                              </small>
                                </p>

                                </>
                            ) : ("")}</td>
                            </tr>
                          </React.Fragment>
                          
                          ))}
                         


                        </tbody>
                      </table>
                         <Pagination currentPage={jobAppResponse.page} totalPages={jobAppResponse.totalPages} ></Pagination>
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
