"use client"
import { getJobApp,JobApp } from '@/app/lists/jobapplications'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { AIResponse, AnalysisResponse, approveJobApp, disapproveJobApp, saveAIAnswerRequest, sendAIPromptRequest, sendAnalyisRequest } from '@/app/actions/jobapplication';
import Modal from '@/app/components/Modal';
import useUser from '@/app/utils/useUser';
import { getMultipileStaff, getStaff } from '@/app/lists/datas/users';
import { connectSocket, socket } from '@/app/utils/socket';


const Page = () => {


  const {id} = useParams()

  const [jobApp, setJobApp] = useState<JobApp>()
  const [showApproveModal,setShowApproveModal] = useState(false)
  const [showDisapproveModal,setShowDisapproveModal] = useState(false)
  const [showSuccessModal,setShowSuccessModal] = useState(false)
  const [showFailureModal,setShowFailureModal] = useState(false)
  const [successTitle,setSuccessTitle] = useState("")
  const [failureTitle,setFailureTitle] = useState("")
  const [failureDesc,setFailureDesc] = useState("")
  const [successDesc,setSuccessDesc] = useState("")
  const [newAnswerIsExist,setNewAnswerIsExist] = useState(false)
  const [aiAnswerSuccess,setAIAnswerSuccess] = useState(false)
  const [answerLoading,setAnswerLoading] = useState(false)
  const [saveLoading,setSaveLoading] = useState(false)


  const [analysisLoading,setAnalysisLoading] = useState(false)
  const [analysisExist,setAnalysisExist] = useState(false)  
  const [analysisKind,setAnalysisKind] = useState("oldest")

  const [aiResponse,setAIResponse] = useState<AIResponse>({
    sendedId:"",
    airesponse:"",
  })

  type AnalysisType = {score:number,name:string,signupdate:string,airesponse:string}

  const [analysisResponse,setAnalysisResponse] = useState<AnalysisType[]>([])


  const {isLoading,user} = useUser()



    useEffect(() => {
          getJobApp(id!.toString())
            .then((data) => setJobApp(data))
            .catch((error) => console.error(error));  
            
            console.log(jobApp)

             socket.on("connect", () => {
              console.log("CONNECTED", socket.id);
                });
            
                socket.on("disconnect", (reason) => {
                  console.log("DISCONNECTED", reason);
                });
            
                socket.on("connect_error", (err) => {
                  console.log("CONNECT ERROR", err);
                });
            
                socket.onAny((event,...args)=>{
                  console.log("Socket event : ",event,args)
                })
            
                const sendCompletedHandler = (payload : {jobId:string,result:unknown}) => {
                    console.log(payload)
                    setAIAnswerSuccess(true)
                    setNewAnswerIsExist(true)
                    setAnswerLoading(false)
                    setAIResponse(payload.result as AIResponse)
                };
            
               
            
                const sendFailedHandler = (payload : {jobId:string,error:string}) => {
                    console.log(payload)
                     setAnswerLoading(false)
                     setAIAnswerSuccess(false)
                };


                const saveCompletedHandler = (payload : {jobId:string,result:unknown}) => {
                    console.log(payload)
                    setSaveLoading(false)
                   
                };
            
                   const saveFailedHandler = (payload : {jobId:string,error:string}) => {
                    console.log(payload)
                     setSaveLoading(false)
                    
                };
               
            
                const elasticFailedHandler = (payload : {jobId:string,error:string}) => {
                    console.log(payload)
                    setAnalysisLoading(false)
                };


                 const elasticCompletedHandler = (payload : {jobId:string,result:unknown}) => {
                    console.log(payload)
                    setAnalysisLoading(false)
                     const data = payload.result as AnalysisResponse
                        console.log(analysisKind," => ",data!.results)
                        if(data!=null && data.results!=null && data.results.length >0){
                          const ids = data.results.map((i)=>(i.sendedId))

                          getMultipileStaff(ids,1,10).then((datas)=>{
                            console.log(datas)
                            const analysisList : AnalysisType[] = []
                            datas.data.map((d)=>{
                                const anResultForId = data.results.find((x)=>x.sendedId == d.id)
                                if(anResultForId !=undefined){
                                  const prompt = d.staffPrompts.at(-1)
                                  if(prompt!=undefined){
                                    analysisList.push({name:d.name,signupdate:d.signupdate.split("T")[0],score:anResultForId.score!,airesponse:prompt.responseText})
                                  }
                                }
                            })
                           if(analysisList.length > 0){
                              setAnalysisExist(true)
                              setAnalysisLoading(false)
                              setAnalysisResponse(analysisList)
                           }else {
                            setAnalysisLoading(false)
                           }
                           setAnalysisKind("oldest")  
                          
                          }).catch((err)=>{

                            console.log(err)
                            setAnalysisLoading(false)
                          })
                        }
                };
            
            
                socket.on("sendprompt-completed", sendCompletedHandler);
                socket.on("sendprompt-failed", sendFailedHandler);


                socket.on("saveprompt-completed", saveCompletedHandler);
                socket.on("saveprompt-failed", saveFailedHandler);


                socket.on("elastic-completed", elasticCompletedHandler);
                socket.on("elastic-failed", elasticFailedHandler);

                 return () => {
                    socket.off("sendprompt-completed", sendCompletedHandler);
                    socket.off("sendprompt-failed", sendFailedHandler);

                    
                    socket.off("saveprompt-completed", saveCompletedHandler);
                    socket.off("saveprompt-failed", saveFailedHandler);

                      socket.off("elastic-completed", elasticCompletedHandler);
                      socket.off("elastic-failed", elasticFailedHandler);
                  };
              

        }, []);


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



              const sendAIRequest = (appId:string) => {
                    setAnswerLoading(true)
                    sendAIPromptRequest(appId).then((id)=>{
                      if(id){
                        const jobId = id
                        connectSocket(jobId,"aiSendQueue",()=>{
                          setAnswerLoading(false);
                        })
                        //websocket işlemleri
                        
                      }
                    }).catch((err)=>{
                      setAIAnswerSuccess(false)
                      console.log("ai response error ",err)
                      setAnswerLoading(false)
                    })
              }

              const saveAIAnswer = (appId:string) =>{
                  if(aiResponse.airesponse!=null){
                  setSaveLoading(true)
                  saveAIAnswerRequest(appId,aiResponse.airesponse).then((id)=>{
                      if(id){
                        const jobId = id
                        connectSocket(jobId,"aiSaveQueue",()=>{
                          setSaveLoading(false);
                        })
                        //websocket işlemleri
                        
                      }
                   
                      
                  }).catch((err)=>{
                    console.log(err)
                    setSaveLoading(false)
                  })
                  }
              }

              const sendAnalysis = (appId:string) => {
                setAnalysisLoading(true)
                if(analysisKind!=""){
                    sendAnalyisRequest(analysisKind,appId).then((id)=>{

                      if(id){
                        const jobId = id
                        connectSocket(jobId,"elasticQueue",()=>{
                          setAnalysisLoading(false);
                        });
                        //websocket işlemleri
                        
                      }
                        

                    }).catch((err)=>{
                      console.log(err)
                      setAnalysisLoading(false)
                    })
                }

              } 

             

  return (

         <div>
          {jobApp!=undefined ? (

            <div>
              <Modal show={showSuccessModal} title={successTitle} message={successDesc}
                                          confirmText='Tamam' cancelText='İptal' setConfirm={false} onConfirm={()=>{}} onCancel={()=>setShowSuccessModal(false)} />
              <Modal show={showFailureModal} title={failureTitle} message={failureDesc}
                                          confirmText='Tamam' cancelText='İptal' setConfirm={false} onConfirm={()=>{}} onCancel={()=>setShowFailureModal(false)} />

              <Modal show={showApproveModal} title="Onaylamak üzeresiniz." message="Onaylamak istediğinize emin misiniz ?" 
                                          confirmText='Onayla' cancelText='Vazgeç' setConfirm={true} onConfirm={()=>directApprove(jobApp.id)} onCancel={()=>setShowApproveModal(false)} />
              
              <Modal show={showDisapproveModal} title="Reddetmek üzeresiniz." message="Reddetmek istediğinize emin misiniz ?" 
                                          confirmText='Reddet' cancelText='Vazgeç' setConfirm={true} onConfirm={()=>directDisapprove(jobApp.id)} onCancel={()=>setShowDisapproveModal(false)} />

               <div className="row justify-content-center">
            <div className="col-md-12">
                 <h2 className="page-title">İş Başvurusu Görüntüle</h2>
              <p className="text-muted">#{jobApp.id} id li <strong> {jobApp.name} </strong> tarafıdan Backend Developer ilanı için yapılan iş başvurusu</p>
            </div>
              <div className="col-md-12 mb-4">
                  <div className="card shadow">
                    <div className="card-body justify-content-center">
                      <h5 className="card-title">CV Analizi</h5>
                          
                            <div className="row mt-4 justify-content-center pl-3 pr-3">
                            {answerLoading==true ? ("Cevap alınıyor..") : (
                              <p>{jobApp.appPrompts!=null && jobApp.appPrompts!=undefined && jobApp.appPrompts.length>0 ? (jobApp.appPrompts.at(-1)!=null &&
                                jobApp.appPrompts.at(-1)!=undefined ? (jobApp.appPrompts.at(-1)!.responseText) : ("")) : (
                              (aiAnswerSuccess==true && aiResponse!=null ? (aiResponse.airesponse) : ("AI Değerledirmesi yok"))
                            )}</p>
                            )}
                            
                            </div>
                            <div className="row mt-4 justify-content-center">
                             {(jobApp.appPrompts==null || jobApp.appPrompts==undefined || jobApp.appPrompts.length==0 || jobApp.appPrompts.at(-1)==null || jobApp.appPrompts.at(-1)==undefined) && (newAnswerIsExist==false)  ? (<button onClick={()=>sendAIRequest(jobApp.id)} className="col-md-12 btn btn-info" type="submit">AI ile Analiz Et</button>):(<>
                               <button onClick={()=>sendAIRequest(jobApp.id)} className="col-md-12 btn btn-primary" type="submit">AI ile Tekrar Analiz et</button>
                             </>)}
                             {newAnswerIsExist==true ? (
                              ((saveLoading==true) ? ("Cevap kaydediliyor...") : (
                                <button onClick={()=>saveAIAnswer(jobApp.id)} className="col-md-12 btn btn-info mb-2" type="submit">Cevabı Kaydet</button>
                              ))
                            ):("")}
                            </div>
                    </div>
                  </div>
                </div>
                {(jobApp.appPrompts!=null && jobApp.appPrompts!=undefined && jobApp.appPrompts.length>0) ? (
                  <div className="col-md-12 mb-4">
                  <div className="card shadow">
                    <div className="card-body justify-content-center">
                      <h5 className="card-title">CV Karşılaştırma</h5>
                            <div className="row mt-4 pl-3 pr-3">
                            <p>Eğer isterseniz iş başvurusunun AI Analizini halihazırda işe alınmış insanların analizleri ile karşılaştırabilirsiniz.</p>
                            </div>
                            
                            {(analysisExist==true) ? (
                              
                <div className="col-md-12 my-1">
                  <div className="card shadow">
                    <div className="card-body">
                      <h5 className="card-title">Analiz Sonuçları</h5>
                      
                      <table className="table table-hover">
                        <thead className="thead-dark">
                          <tr>
                            <th>Benzerlik Oranı</th>
                            <th>İsim</th>
                            <th>Giriş tarihi</th>
                            <th>Personel için AI Analizi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(analysisResponse.length > 0 ? (
                            (analysisResponse.map((anr)=>(
                            <tr key={anr.name}>
                            <td>
                              <div className="progress progress-sm" style={{height:"3px"}}>
                                <div
                                className="progress-bar"
                                role="progressbar"
                                style={{ width: `${anr.score*100-2}%` }}
                                aria-valuenow={anr.score*100-2}
                                aria-valuemin={0}
                                aria-valuemax={100}
                              ></div>
                              </div>
                            </td>
                            <td>{anr.name}</td>
                            <td>{anr.signupdate}</td>
                            <td>{anr.airesponse} </td>
                          </tr>
                            )))
                            
                          ) : ("Analiz bulunamadı.."))}
                         
                        
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div> 
                            ) : ("")}
                           
                            <div className="row mt-4 justify-content-center">
                              {(analysisLoading==true ? ("Analiz yapılıyor...") : (
                                  <>
                                  
                                  <div className="form-group col-md-12 mb-3">
                             
                                    <select onChange={(e)=>{
                                      console.log("Seçildi:", e.target.value);
                                      setAnalysisKind(e.target.value)}}   className="form-control" id="simple-select2">
                                      <option value="oldest">Bu iş başvurusunu aynı pozisyondaki en kıdemli kişilerle karşılaştır.</option>
                                      <option  value="newest">Bu iş başvurusunu aynı pozisyondaki en yeni kişilerle karşılaştır.</option>
                                    </select> 
                                </div>
                                 <button onClick={()=>{sendAnalysis(jobApp.id)}} className="col-md-12 btn btn-info mb-2" type="submit">Karşlılaştırma Yap</button>
                                  </>
                                ))}
                               
                            </div>
                    </div>
                  </div>
                </div>
                ) : ("")}
                

            <div className="col-12">
             
              <div className="card shadow mb-4">
                <div className="card-header">
                  <strong className="card-title">Temel Bilgiler</strong>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label htmlFor="simpleinput">Ad ve Soyad</label>
                        <input value={jobApp.name} disabled type="text" id="simpleinput" className="form-control" />
                      </div>
                      <div className="form-group mb-3">
                        <label htmlFor="example-email">Email</label>
                        <input disabled type="email" id="example-email" name="example-email" className="form-control" value={jobApp.email} />
                      </div>
                     
                      <div className="form-group mb-3">
                        <label htmlFor="example-palaceholder">Telefon numarası :</label>
                        <input disabled className="form-control input-phoneus" id="custom-phone" value={jobApp.phone_number} />
                      </div>

                        <div className="form-group mb-3">
                        <label htmlFor="example-palaceholder">Doğum tarihi</label>
                        <input disabled className="form-control" id="example-date" type="date" name="date" value={jobApp.birthdate.split("T")[0].toString()} />
                      </div>
                    </div> 
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                      
                          <label htmlFor="simple-select2">Mezun olunan üniversite </label>
                          <input disabled type="text" id="university" name="example-university" className="form-control" value={jobApp.university} />
                     </div>
                      <div className="form-group mb-3">
                          <label htmlFor="simple-select">Bölüm </label>
                         <input disabled type="text" id="university" name="example-university" className="form-control" value={jobApp.unidepartment} />
                     </div>
                      <div className="form-group mb-3">
                        <label htmlFor="example-disable">Mezuniyet tarihi</label>
                        <input disabled value={jobApp.graduatedate.split("T")[0].toString()} className="form-control" id="example-date" type="date" name="date"  />
                      </div>
                     
                    </div>
                  </div>
                </div>
              </div> 
            
             


            </div> 


             <div className="col-12">
           
              <div className="card shadow mb-4">
                <div className="card-header">
                  <strong className="card-title">Adres bilgileri</strong>
                </div>
                <div className="card-body">
                    <div className="row">
                         <div className="col-md-12 form-group mb-3">
                          <label htmlFor="address-wpalaceholder">Adres</label>
                          <input type="text" id="address-wpalaceholder" className="form-control" value={jobApp.address} disabled />
                          <div className="valid-feedback"> Looks good! </div>
                          <div className="invalid-feedback"> Badd address </div>
                        </div>

                        <div className="col-md-12 form-row">
                          <div className="col-md-6 mb-3">
                            <label htmlFor="validationSelect2">Yaşadığı Şehir</label>
                            <input value={jobApp.city} type="text" className="form-control" id="validationCustom33" disabled />
                            <div className="invalid-feedback"> Please select a valid state. </div>
                          </div>
                          <div className="col-md-3 mb-3">
                            <label htmlFor="validationCustom33">Yaşadığı İlçe</label>
                            <input value={jobApp.county} type="text" className="form-control" id="validationCustom33" disabled />
                            <div className="invalid-feedback"> Please provide a valid city. </div>
                          </div>
                          
                          <div className="col-md-3 mb-3">
                            <label htmlFor="custom-zip">Posta kodu</label>
                            <input value={jobApp.postcode} className="form-control input-zip" id="custom-zip" disabled />
                            <div className="invalid-feedback"> Please provide a valid zip. </div>
                          </div>
                        </div>
                    </div>
                  </div>
                  </div>
                  </div>

             <div className="col-12">
           
              <div className="card shadow mb-4">
                <div className="card-header">
                  <strong className="card-title">Yetenekler & Projeler</strong>
                </div>
                <div className="card-body">

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                          <label htmlFor="simpleinput">Github vb. Portfolyo Linki </label>
                          <input disabled value={jobApp.githublink} type="text" id="simpleinput" className="form-control" />
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label htmlFor="simpleinput">Linkedin Linki </label>
                          <input disabled value={jobApp.linkedinlink} type="text" id="simpleinput" className="form-control" />
                      </div>
                    </div>

                    <div className="col-md-12">
                       <label htmlFor="multi-select2">Yetenekleri</label>
                       <input disabled value={jobApp.abilities} type="text" id="simpleinput" className="form-control" />
                    </div>

                  </div>

                </div>
                </div>
                </div>


          


          </div> 

         

           <div className="row mb-4">
                <div className="col-md-12">
                  <div className="card shadow">
                    <div className="card-body">
                      <h5 className="card-title">Biyografi</h5>
                     
                          <textarea disabled className="form-control" id="validationTextarea1" value={jobApp.selfbio}  required rows={3}></textarea>
                          <div className="invalid-feedback"> Please enter a message in the textarea. </div>
                    </div>
                  </div>
                </div>
              </div> 

              
           <div className="row mb-4">
                <div className="col-md-12">
                  <div className="card shadow">
                    <div className="card-body">
                       
                        <div className="row">
                        {(jobApp.staffapproved && !jobApp.managerapproved) ? (
                          
                                  <div className="col-md-12">

                                  <div className="col-md-12">
                                  <h5>Bu iş başvurusu personel tarafından onaylanmıştır.Yönetici onayı gereklidir</h5>
                                  </div>

                                   
                                    {(user!=undefined && user.data.role == "admin") ? (
                                      <div className='col-md-12'>
                                    <button onClick={(e)=>setShowApproveModal(true)} className="col-md-6 btn btn-success" type="submit">Onayla</button>
                                    <button onClick={(e)=>setShowDisapproveModal(true)} className="col-md-6 btn btn-danger" type="submit">Reddet</button>
                                    </div>

                                    ) : (
                                      <div></div>
                                    )}
                                    
                                </div>
       
                          
                        ) : (
                          (jobApp.managerapproved) ? (
                            <div className="col-md-12">
                                  <h5 className='text-2xl red'>Bu iş başvurusu yönetici tarafından onaylanmıştır.</h5>
                              </div>

                          ) : (
                            <div className="col-md-12">
                             {(user!=undefined && user.data.role == "admin" && jobApp.disapproved) ? (
                             <h5 className='text-2xl red'>Bu iş başvurusu reddedilmiştir.Tekrar işlem yapmak için aşağıdakilerden birini seçin.</h5>
                             ):("")}

                            <button onClick={(e)=>setShowApproveModal(true)} className="col-md-6 btn btn-success" type="submit">Onayla</button>
                            <button onClick={(e)=>setShowDisapproveModal(true)} className="col-md-6 btn btn-danger" type="submit">Reddet</button>
                            </div>
                          )

                        )}
                          
                           

                          
                          </div>
                    </div>
                  </div>
                </div>
              </div> 
            </div>

          ) : (
            <p>Bu iş başvurusunun kaydı bulunamadı.</p>
          )}
         

              </div>
    

  )
}

export default Page
