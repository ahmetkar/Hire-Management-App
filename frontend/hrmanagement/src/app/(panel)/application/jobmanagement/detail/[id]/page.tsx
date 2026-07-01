"use client"
import { useParams } from 'next/navigation'
import React from 'react'



const page = () => {


  const {id} = useParams()



  return (
  
         <div>
          <div className="row justify-content-center">
            <div className="col-md-12">
                 <h2 className="page-title">İş Başvurusu Görüntüle</h2>
              <p className="text-muted">#{id} nolu Backend Developer İlanı için <strong> Ahmet Kar </strong> tarafıdan yapılan iş başvurusu</p>
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
                            <button className="col-md-6 btn btn-info" type="submit">Cevabı Kopyala</button>
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
                        <input value="Ahmet Kar" disabled type="text" id="simpleinput" className="form-control" />
                      </div>
                      <div className="form-group mb-3">
                        <label htmlFor="example-email">Email</label>
                        <input disabled type="email" id="example-email" name="example-email" className="form-control" value="Email@gmail.com" />
                      </div>
                     
                      <div className="form-group mb-3">
                        <label htmlFor="example-palaceholder">Telefon numarası :</label>
                        <input disabled className="form-control input-phoneus" id="custom-phone" placeholder="(987) 654-3210" />
                      </div>

                        <div className="form-group mb-3">
                        <label htmlFor="example-palaceholder">Doğum tarihi</label>
                        <input disabled className="form-control" id="example-date" type="date" name="date" />
                      </div>
                    </div> 
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                      
                          <label htmlFor="simple-select2">Mezun olduğunuz üniversite </label>
                          <input disabled type="text" id="university" name="example-university" className="form-control" value="Sivas Cumhuriyet Üniversitesi" />
                     </div>
                      <div className="form-group mb-3">
                          <label htmlFor="simple-select">Bölümünüz </label>
                         <input disabled type="text" id="university" name="example-university" className="form-control" value="Bilgisayar Mühendisliği" />
                     </div>
                      <div className="form-group mb-3">
                        <label htmlFor="example-disable">Mezuniyet tarihi</label>
                        <input disabled value="2024-02-02" className="form-control" id="example-date" type="date" name="date" />
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
                          <label htmlFor="address-wpalaceholder">Address</label>
                          <input type="text" id="address-wpalaceholder" className="form-control" placeholder="Adres satırı" disabled />
                          <div className="valid-feedback"> Looks good! </div>
                          <div className="invalid-feedback"> Badd address </div>
                        </div>

                        <div className="col-md-12 form-row">
                          <div className="col-md-6 mb-3">
                            <label htmlFor="validationSelect2">Yaşadığınız Şehir</label>
                            <input value="Gaziantep" type="text" className="form-control" id="validationCustom33" disabled />
                            <div className="invalid-feedback"> Please select a valid state. </div>
                          </div>
                          <div className="col-md-3 mb-3">
                            <label htmlFor="validationCustom33">Yaşadığınız İlçe</label>
                            <input value="Şahinbey" type="text" className="form-control" id="validationCustom33" disabled />
                            <div className="invalid-feedback"> Please provide a valid city. </div>
                          </div>
                          
                          <div className="col-md-3 mb-3">
                            <label htmlFor="custom-zip">Posta kodu</label>
                            <input value="27000" className="form-control input-zip" id="custom-zip" disabled />
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
                          <input disabled value="http://github.com" type="text" id="simpleinput" className="form-control" />
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label htmlFor="simpleinput">Linkedin Linki </label>
                          <input disabled value="http://linkedin.com" type="text" id="simpleinput" className="form-control" />
                      </div>
                    </div>

                    <div className="col-md-12">
                       <label htmlFor="multi-select2">Yetenklerinizi Ekleyin</label>
                       <input disabled value="c#,html,css,js" type="text" id="simpleinput" className="form-control" />
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
                      <h5 className="card-title">Kendinden Bahset</h5>
                     
                          <textarea disabled className="form-control" id="validationTextarea1" placeholder="Take a note here" required rows={3}></textarea>
                          <div className="invalid-feedback"> Please enter a message in the textarea. </div>
                    </div>
                  </div>
                </div>
              </div> 

              
           <div className="row mb-4">
                <div className="col-md-12">
                  <div className="card shadow">
                    <div className="card-body">
                      <h5 className="card-title">Onay/Red</h5>
                        
                          
                          <textarea className="form-control" id="validationTextarea1" placeholder="Yöneticiye not bırak" required rows={3}></textarea><br />
                          <div className="invalid-feedback"> Please enter a message in the textarea. </div>
                          <div className="row">
                          <button className="col-md-6 btn btn-success" type="submit">Onayla ve Yöneticiye Gönder</button>
                          <button className="col-md-6 btn btn-danger" type="submit">Reddet</button>
                          </div>
                    </div>
                  </div>
                </div>
              </div> 

              </div>
    

  )
}

export default page
