import React from 'react'

const page = () => {
  return (
    <div>
        <div className="row justify-content-center">
            <div className="col-12">
              <h2 className="page-title">İş Başvurusu Yapın</h2>
              <p className="text-muted">Backend Developer Pozisyonu İçin İş Başvurusu formu.</p>
              <div className="card shadow mb-4">
                <div className="card-header">
                  <strong className="card-title">Temel Bilgiler</strong>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label htmlFor="simpleinput">Ad ve Soyad</label>
                        <input type="text" id="simpleinput" className="form-control" />
                      </div>
                      <div className="form-group mb-3">
                        <label htmlFor="example-email">Email</label>
                        <input type="email" id="example-email" name="example-email" className="form-control" placeholder="Email" />
                      </div>
                     
                      <div className="form-group mb-3">
                        <label htmlFor="example-palaceholder">Telefon numarası :</label>
                        <input className="form-control input-phoneus" id="custom-phone" placeholder="(987) 654-3210" />
                      </div>

                        <div className="form-group mb-3">
                        <label htmlFor="example-palaceholder">Doğum tarihi</label>
                        <input className="form-control" id="example-date" type="date" name="date" />
                      </div>
                    </div> 
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                      
                          <label htmlFor="simple-select2">Mezun olduğunuz üniversite </label>
                          <select className="form-control select2" id="simple-select2">
                            <optgroup label="Alaskan/Hawaiian Time Zone">
                              <option value="AK">Alaska</option>
                              <option value="HI">Hawaii</option>
                            </optgroup>
                            <optgroup label="Pacific Time Zone">
                              <option value="CA">CalihtmlFornia</option>
                              <option value="NV" disabled>Nevada (disabled)</option>
                              <option value="OR">Oregon</option>
                              <option value="WA">Washington</option>
                            </optgroup>
                          </select>
                     </div>
                      <div className="form-group mb-3">
                          <label htmlFor="simple-select">Bölümünüz </label>
                          <select className="form-control select2" id="simple-select">
                            <optgroup label="Alaskan/Hawaiian Time Zone">
                              <option value="AK">Alaska</option>
                              <option value="HI">Hawaii</option>
                            </optgroup>
                            <optgroup label="Pacific Time Zone">
                              <option value="CA">CalihtmlFornia</option>
                              <option value="NV" disabled>Nevada (disabled)</option>
                              <option value="OR">Oregon</option>
                              <option value="WA">Washington</option>
                            </optgroup>
                          </select>
                     </div>
                      <div className="form-group mb-3">
                        <label htmlFor="example-disable">Mezuniyet tarihi</label>
                        <input className="form-control" id="example-date" type="date" name="date" />
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
                          <input type="text" id="address-wpalaceholder" className="form-control" placeholder="Adresinizi girin :" />
                          <div className="valid-feedback"> Looks good! </div>
                          <div className="invalid-feedback"> Badd address </div>
                        </div>

                        <div className="col-md-12 form-row">
                          <div className="col-md-6 mb-3">
                            <label htmlFor="validationSelect2">Yaşadığınız Şehir</label>
                            <select className="form-control select2" id="validationSelect2" required>
                              <option value="">Select state</option>
                              <optgroup label="Mountain Time Zone">
                                <option value="AZ">Arizona</option>
                                <option value="CO">Colorado</option>
                                <option value="ID">Idaho</option>
                                <option value="MT">Montana</option>
                                <option value="NE">Nebraska</option>
                                <option value="NM">New Mexico</option>
                                <option value="ND">North Dakota</option>
                                <option value="UT">Utah</option>
                                <option value="WY">Wyoming</option>
                              </optgroup>
                              <optgroup label="Central Time Zone">
                                <option value="AL">Alabama</option>
                                <option value="AR">Arkansas</option>
                                <option value="IL">Illinois</option>
                                <option value="IA">Iowa</option>
                                <option value="KS">Kansas</option>
                                <option value="KY">Kentucky</option>
                                <option value="LA">Louisiana</option>
                                <option value="MN">Minnesota</option>
                                <option value="MS">Mississippi</option>
                                <option value="MO">Missouri</option>
                                <option value="OK">Oklahoma</option>
                                <option value="SD">South Dakota</option>
                                <option value="TX">Texas</option>
                                <option value="TN">Tennessee</option>
                                <option value="WI">Wisconsin</option>
                              </optgroup>
                            </select>
                            <div className="invalid-feedback"> Please select a valid state. </div>
                          </div>
                          <div className="col-md-3 mb-3">
                            <label htmlFor="validationCustom33">Yaşadığınız İlçe</label>
                            <input type="text" className="form-control" id="validationCustom33" required />
                            <div className="invalid-feedback"> Please provide a valid city. </div>
                          </div>
                          
                          <div className="col-md-3 mb-3">
                            <label htmlFor="custom-zip">Posta kodu</label>
                            <input className="form-control input-zip" id="custom-zip" autoComplete="false" maxLength={9} required />
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
                          <input type="text" id="simpleinput" className="form-control" />
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label htmlFor="simpleinput">Linkedin Linki </label>
                          <input type="text" id="simpleinput" className="form-control" />
                      </div>
                    </div>

                    <div className="col-md-12">
                       <label htmlFor="multi-select2">Yetenklerinizi Ekleyin</label>
                          <select className="form-control select2-multi" id="multi-select2">
                            <optgroup label="Mountain Time Zone">
                              <option value="AZ">Arizona</option>
                              <option value="CO">Colorado</option>
                              <option value="ID">Idaho</option>
                              <option value="MT">Montana</option>
                              <option value="NE">Nebraska</option>
                              <option value="NM">New Mexico</option>
                              <option value="ND">North Dakota</option>
                              <option value="UT">Utah</option>
                              <option value="WY">Wyoming</option>
                            </optgroup>
                            <optgroup label="Central Time Zone">
                              <option value="AL">Alabama</option>
                              <option value="AR">Arkansas</option>
                              <option value="IL">Illinois</option>
                              <option value="IA">Iowa</option>
                              <option value="KS">Kansas</option>
                              <option value="KY">Kentucky</option>
                              <option value="LA">Louisiana</option>
                              <option value="MN">Minnesota</option>
                              <option value="MS">Mississippi</option>
                              <option value="MO">Missouri</option>
                              <option value="OK">Oklahoma</option>
                              <option value="SD">South Dakota</option>
                              <option value="TX">Texas</option>
                              <option value="TN">Tennessee</option>
                              <option value="WI">Wisconsin</option>
                            </optgroup>
                          </select>
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
                      <label htmlFor="validationTextarea1">Açıklama sonrar gelicek..</label>
                          <textarea className="form-control" id="validationTextarea1" placeholder="Take a note here" required rows={3}></textarea>
                          <div className="invalid-feedback"> Please enter a message in the textarea. </div>
                    </div>
                  </div>
                </div>
              </div> 


               <div className="row mb-4">
                <div className="col-md-12">
                    <div className="form-group">
                          <div className="form-check">
                            <input className="form-check-input" type="checkbox" value="" id="invalidCheck" required />
                            <label className="form-check-label" htmlFor="invalidCheck"> Şartları kabul ediyorum </label>
                            <div className="invalid-feedback"> You must agree behtmlFore submitting. </div>
                          </div>
                        </div>
                        <button className="col-md-12 btn btn-primary" type="submit">Başvuru yap</button>
                </div>
               </div>

      
    </div>
  )
}

export default page
