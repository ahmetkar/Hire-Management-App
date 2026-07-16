"use client"
import { getJobApp,JobApp } from '@/app/lists/jobapplications'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { approveJobApp, disapproveJobApp } from '@/app/actions/jobapplication';
import Modal from '@/app/components/Modal';
import useUser from '@/app/utils/useUser';


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

  const {isLoading,user} = useUser()




  console.log(user)

    useEffect(() => {
          getJobApp(id!.toString())
            .then((data) => setJobApp(data))
            .catch((error) => console.error(error));  
            
            console.log(jobApp)
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
              <p className="text-muted">#{jobApp.id} nolu Backend Developer İlanı için <strong> {jobApp.name} </strong> tarafıdan yapılan iş başvurusu</p>
            </div>
              <div className="col-md-12 mb-4">
                  <div className="card shadow">
                    <div className="card-body justify-content-center">
                      <h5 className="card-title">CV Analizi</h5>
                            <div className="row">
                            <button className="col-md-12 btn btn-info" type="submit">AI ile Analiz Et</button><br /><br />
                            </div>
                            <div className="row mt-4">
                            <p>Özet burada görünür..</p>
                            </div>
                            <div className="row mt-4 justify-content-center">
                            <button className="col-md-6 btn btn-info" type="submit">Cevabı Kaydet</button>
                            <button className="col-md-6 btn btn-danger" type="submit">Cevabı Gizle</button>
                            </div>
                    </div>
                  </div>
                </div>

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
