"use client"
import { searchJobApps,getJobApps, JobAppsResponse, getMultipileJobApps } from '@/app/lists/jobapplications';
import { useSearchParams,useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Pagination from '../utils/pagination';
import {ArrowDown, ArrowUp, Router} from "lucide-react"
import Modal from '@/app/components/Modal';
import {AIResponse, AIResponseElement, AIResponses, approveJobApp, disapproveJobApp, saveMultipileAIAnswerRequest, SaveRequest, sendMultipileAIPromptRequest } from '@/app/actions/jobapplication';


const Page = () => {

const defaultLimit = 1
const [activeId,setActiveId] = useState("")
const [detailForId,setDetailForId] = useState("")
const [type,setType] = useState("new")
const [showApproveModal,setShowApproveModal] = useState(false)
const [showDisapproveModal,setShowDisapproveModal] = useState(false)
const [showSuccessModal,setShowSuccessModal] = useState(false)
const [showFailureModal,setShowFailureModal] = useState(false)
const [successTitle,setSuccessTitle] = useState("")
const [failureTitle,setFailureTitle] = useState("")
const [failureDesc,setFailureDesc] = useState("")
const [successDesc,setSuccessDesc] = useState("")
const [checkedIds,setCheckedIds] = useState<string[]>([])

const [checkedSaveIds,setCheckedSaveIds] = useState<string[]>([])

const [aiPromptsExist,setAIPromptsExist] = useState(false) 

const [aiPromptsFail,setAIPromptsFail] = useState(false) 
const [aiPromptsLoading,setAIPromptsLoading] = useState(false) 

const [aiResponses,setAIResponses] = useState<AIResponseElement[]>([])
const aiJobLimit = 2
const [aiJobIdList,setAIJobIdList] = useState<string[]>([])
const [aiJobResponses,setAIJobResponses] = useState<JobAppsResponse>({
  data:[],
  total:0,
  page:1,
  limit:aiJobLimit,
  totalPages:0
})

const [saveaiPromptsLoading,setSaveAIPromptsLoading] = useState(false) 

const [saveAIPromptSuccess,setSaveAIPromptSuccess] = useState(false) 
const [saveAIPromptFail,setSaveAIPromptFail] = useState(false) 


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


     const apage = Number(params.get("apage")) || 1
   
  
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



      useEffect(() => {
        
       getMultipileJobApps(aiJobIdList,apage,aiJobLimit).then((jobappdata)=>{
                  console.log("jobappdata",jobappdata)
                  setAIJobResponses(jobappdata)
                }).catch((err)=>{
                  console.log("jobapperr",err)
                })
        
      }, [apage,aiJobIdList]);




      const setLimit = (e:React.ChangeEvent<HTMLSelectElement>) => {
        setCheckedIds([])
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

      const setNType = (e:React.ChangeEvent<HTMLSelectElement>) => {
        setCheckedIds([])
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
      }


      const doSearch = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setCheckedIds([])
        const searchstr  = e.target.value
        const searchParams = new URLSearchParams(params.toString())
      
        searchParams.set("limit",limit.toString())
        searchParams.set("page","1")
        searchParams.set("type",type)
        searchParams.set("search",searchstr)
        
        router.push(`?${searchParams.toString()}`)
        
      }


      const directApprove = (id:string) => {
          setShowApproveModal(false)
          approveJobApp(id)
          .then((data) => {
              setSuccessTitle("Onaylama başarılı oldu")
              setSuccessDesc(data[0])
              setShowSuccessModal(true)
          })
          .catch((error) => {
              setFailureTitle("Onaylama başarısız oldu")
              setFailureDesc(error)
              setShowFailureModal(true)
          });  
      }

      const directDisapprove = (id:string) => {
          setShowDisapproveModal(false)
            disapproveJobApp(id)
          .then((data) => {
            
              setSuccessTitle("Red işlemi başarılı oldu")
              setSuccessDesc(data[0])
              setShowSuccessModal(true)
            
          })
          .catch((error) => {
              setFailureTitle("Red işlemi başarısız oldu")
              setFailureDesc(error)
              setShowFailureModal(true)
          }); 
      }

      const handleCheckboxChange = (id: string, checked: boolean) => {
        setCheckedIds((prev) => {
          if (checked) {
            if (prev.includes(id)) return prev;

            return [...prev, id];
          }

          return prev.filter((item) => item !== id);
        });

       
        }

        const handleSaveCheckboxChange = (id: string, checked: boolean) => {
        setCheckedSaveIds((prev) => {
          if (checked) {
            if (prev.includes(id)) return prev;

            return [...prev, id];
          }

          return prev.filter((item) => item !== id);
        });

       
        }

         const sendMultipilePrompt = ()=>{
          if(checkedIds.length == 0){
            setAIPromptsFail(true)
             setTimeout(() => {
                      setAIPromptsFail(false);
            }, 3000);
            return;
          }
          setAIPromptsLoading(true)
          sendMultipileAIPromptRequest(checkedIds).then((data)=>{
                console.log(data)
                if(data.result!=undefined){
                const idList : string[]  = []
                data.result.map((i)=>{
                  idList.push(i.sendedId)
                })
                
                getMultipileJobApps(idList,apage,aiJobLimit).then((jobappdata)=>{
                  console.log("jobappdata",jobappdata)
                  setAIJobResponses(jobappdata)
                  setAIJobIdList(idList)
                }).catch((err)=>{
                  console.log("jobapperr",err)
                })
                setAIResponses(data.result)
                setAIPromptsExist(true)
                setAIPromptsFail(false)
                 
                
              }
              setAIPromptsLoading(false)
          }).catch((err)=>{
            console.log(err)
            setAIPromptsExist(false)
            setAIPromptsFail(true)
            setTimeout(() => {
              setAIPromptsFail(false);
            }, 3000);
            setAIPromptsLoading(false)
          })

        }


        const saveMultipilePrompt = ()=>{
              setSaveAIPromptsLoading(true)
              if(aiResponses!=undefined){
              const responseMap = new Map(
                    aiResponses.map(r => [r.sendedId, r])
                );

            const reqs: SaveRequest[] = [];

            for (const id of checkedSaveIds) {
                const resp = responseMap.get(id);
                if (!resp) continue;

                reqs.push({
                    sendedId: id,
                    result: resp.result,
                    preembedding: resp.embedding,
                    prompt: resp.prompt,
                    embedding: null
                });
              }

              saveMultipileAIAnswerRequest(reqs).then((data)=>{
                  if(data){
                    setSaveAIPromptSuccess(true)
                    setSaveAIPromptFail(false)
                     setTimeout(() => {
                      setSaveAIPromptSuccess(false);
                  }, 3000);
                  }else {
                    setSaveAIPromptFail(true)
                    setSaveAIPromptSuccess(false)
                    setTimeout(() => {
                      setSaveAIPromptFail(false);
                  }, 3000);
                  }
                  setSaveAIPromptsLoading(false)
              }).catch((err)=>{
                setSaveAIPromptFail(true)
                 setTimeout(() => {
                      setSaveAIPromptFail(false);
                  }, 3000);
                setSaveAIPromptSuccess(false)
                setSaveAIPromptsLoading(false)
                console.log(err)
              })

              }
        };


        const backNormal = () => {
            setAIPromptsExist(false)
            setAIJobResponses({
                data:[],
                total:0,
                page:1,
                limit:5,
                totalPages:0
              })

            setCheckedSaveIds([])
            setCheckedIds([])
      
            const aParams = new URLSearchParams(params.toString())
          
            aParams.set("apage","")
            
            router.push(`?${aParams.toString()}`)
              
        }
 
  return (
    <div>
        <Modal show={showSuccessModal} title={successTitle} message={successDesc}
                            confirmText='Tamam' cancelText='İptal' setConfirm={false} onConfirm={()=>{}} onCancel={()=>setShowSuccessModal(false)} />
        <Modal show={showFailureModal} title={failureTitle} message={failureDesc}
                            confirmText='Tamam' cancelText='İptal' setConfirm={false} onConfirm={()=>{}} onCancel={()=>setShowFailureModal(false)} />
        
        {aiPromptsExist && aiJobResponses!=undefined ? (

          <div>
            
            <h2 className="h4 mb-1">AI Analiz Sonuçları</h2>
            <p className="mb-3">Seçilen iş başvuruları için analiz sonuçları aşağıdaki gibidir.</p>
            <div className="card shadow">
              <div className="card-body">
              <div className="row">

                <button onClick={()=>{backNormal()}} className="col-md-2 btn btn-danger" type="submit">İptal et ve Geri dön</button>

                {(saveAIPromptSuccess==true) ? ("Seçtiğiniz AI Promptları Başarıyla Kaydedildi.") : (
                <div className="col-md-2">
                {saveAIPromptFail==true ? ("AI Promptları Kaydedilirken Sorun Oluştu.") : (<div className="col-md-12">
                  {saveaiPromptsLoading==true ? ("Seçilenler veritabanına kaydediliyor...") : (<button onClick={()=>{saveMultipilePrompt()}} className="col-md-12 btn btn-info" type="submit">Seçilenleri Kaydet</button>)}
                </div>)}
                </div>
                )}

                
                
            </div>

                <div className="row">
                  <p className="col-md-8">Seçili satır: {checkedSaveIds.length}</p>
                  <table className="col-md-12 table table-borderless table-hover">
                        <thead>
                          <tr>
                            <td></td>
                            <th>ID</th>
                            <th>İsim-Soyisim/Mezuniyet</th>
                            <th>İlan İd</th>
                            <th>İletişim Bilgileri</th>
                            <th>Ülke</th>
                            <th>Başvuru Tarihi</th>
                            <th>Durum</th>
                          </tr>
                        </thead>
                        <tbody>
                          
                          {aiJobResponses.data.map((uap)=>(
                            
                            
                            <React.Fragment key={uap.id}>
                            
                            <tr>
                            <td><div className="custom-control custom-checkbox">
                             <input checked={checkedSaveIds.includes(uap.id)} onChange={(e)=>{handleSaveCheckboxChange(uap.id,e.target.checked)}} type="checkbox" className="custom-input" id="customCheck1-1" />
                        
                          </div></td>
                            
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

                                <small className="mb-0 text-muted">İlan Id : {uap.position.id}</small>
                              </p>
                              
                               <p className="mb-0 text-muted">
                                <small className="mb-0 text-muted">İlan Başlık : {uap.position.jobtitle}</small>
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
                            <td>{uap.managerapproved ? "Onaylı" : uap.staffapproved ? "Yönetici Onayı Bekliyor" : uap.disapproved ? "Reddedilmiş" : "Onay Bekliyor"}</td>
                           
                            </tr>
                            <tr>
                            <td></td>
                            <td colSpan={8}>
                               <p className='mb-0'>
                                <small className="mb-0">
                                <strong>AI Değerlendirmesi :</strong> 
                                  {
                                     aiResponses.find(x=>x.sendedId == uap.id)?.result
                                    }
                              </small>
                                </p>

                            </td>
                            </tr>
                          </React.Fragment>
                          
                          ))}

                        </tbody>
                </table>
              <div className="col-md-12 justify-content-center">
              <Pagination pname="apage" currentPage={aiJobResponses.page} totalPages={aiJobResponses.totalPages} ></Pagination>   
              </div>
                </div>
              </div>
               
            </div>
          </div>
          ) : (
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
                                <select defaultValue="new" onChange={(e)=>setNType(e)} className="custom-select my-1 mr-sm-2" id="inlineFormCustomSelectPref">
                                 
                                  <option value="new">Yeni Başvuru</option>
                                  <option  value="waiting">Yönetici Onayı Bekliyor</option>
                                  <option value="approved">Onaylanan</option>
                                  <option value="disapproved">Reddedilen</option>
                                </select>
                              </div>
                            <div className="form-group col-auto">
                              <label htmlFor="search" className="sr-only">Search</label>
                              <input onChange={(e)=>doSearch(e)} type="text" className="form-control" id="search1" placeholder={"isim,soyisim veya başka detay .."} />
                            </div>
                          </div>
                        </form>
                      </div>
                      <div className="row mb-4">
                      <p className="col-md-9">Seçili satır: {checkedIds.length}</p>

                      {aiPromptsFail==true ? ("AI analiz isteği başarısız oldu.") : (<div className="col-md-3">
                          {(aiPromptsLoading==true ? ("Seçili Satırlar İçin AI Analizi Yapılıyor...") : (
                          
                          <button onClick={()=>{sendMultipilePrompt()}} className="col-md-12 btn btn-secondary" type="submit">Seçili Satırları AI ile Analiz Et</button>
                        ))}
                      </div>)}
                      
                      </div>
                      <table className="table table-borderless table-hover">
                        <thead>
                          <tr>
                            <td></td>
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
                            <td><div className="custom-control custom-checkbox">
                            <input checked={checkedIds.includes(uap.id)} onChange={(e)=>{handleCheckboxChange(uap.id,e.target.checked)}} type="checkbox" className="custom-input" id="customCheck1-1" />
                        
                          </div></td>
                            <td>
                              <Modal show={showApproveModal} title="Onaylamak üzeresiniz." message="Onaylamak istediğinize emin misiniz ?" 
                            confirmText='Onayla' cancelText='Vazgeç' setConfirm={true} onConfirm={()=>directApprove(uap.id)} onCancel={()=>setShowApproveModal(false)} />

                            <Modal show={showDisapproveModal} title="Reddetmek üzeresiniz." message="Reddetmek istediğinize emin misiniz ?" 
                            confirmText='Reddet' cancelText='Vazgeç' setConfirm={true} onConfirm={()=>directDisapprove(uap.id)} onCancel={()=>setShowDisapproveModal(false)} />
                          
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

                                <small className="mb-0 text-muted">İlan Id : {uap.position.id}</small>
                              </p>
                              
                               <p className="mb-0 text-muted">
                                <small className="mb-0 text-muted">İlan Başlık : {uap.position.jobtitle}</small>
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
                            <td>{uap.managerapproved ? "Onaylı" : uap.staffapproved ? "Yönetici Onayı Bekliyor" : uap.disapproved ? "Reddedilmiş" : "Onay Bekliyor"}</td>
                            <td><button className="btn btn-sm dropdown-toggle more-horizontal" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span className="text-muted sr-only">Aksiyonlar</span>
                              </button>
                              <div className="dropdown-menu dropdown-menu-right">
                            
                                <a className="dropdown-item" href={`/application/jobmanagement/detail/${uap.id}`}>İncele</a>
                                <a onClick={(e)=>setShowApproveModal(true)} className="dropdown-item">Direkt Onayla</a>
                                <a onClick={(e)=>setShowDisapproveModal(true)} className="dropdown-item">Direkt Reddet</a>
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
                                {uap.appPrompts!=null && uap.appPrompts!=undefined && uap.appPrompts.length>0 ? uap.appPrompts[0].responseText : "AI Değerlendirmesi bulunamadı."}
                              </small>
                                </p>

                                </>
                            ) : ("")}</td>
                            </tr>
                          </React.Fragment>
                          
                          ))}
                         


                        </tbody>
                      </table>
                         <Pagination pname="page" currentPage={jobAppResponse.page} totalPages={jobAppResponse.totalPages} ></Pagination>
                    </div>
                  </div>
                </div> 
              </div> 

       
            
            </div>
          </div>

          )}
       
         

        </div> 
  )
}

export default Page
