import React from 'react'

const page = () => {
  return (
     <div>
          <div className="row justify-content-center">
            <div className="col-12 col-lg-10 col-xl-8">
              <h2 className="h3 mb-4 page-title">Profil Ayarlarım</h2>
              <div className="my-4">
             
                  <div className="row mt-5 align-items-center">
                    <div className="col-md-3 text-center mb-5">
                      <div className="avatar avatar-xl">
                        <img src="./assets/avatars/face-1.jpg" alt="..." className="avatar-img rounded-circle" />
                      </div>
                    </div>
                    <div className="col">
                      <div className="row align-items-center">
                        <div className="col-md-7">
                          <h4 className="mb-1">Ahmet Kar</h4>
                          <p className="small mb-3"><span className="badge badge-dark">Gaziantep,Türkiye</span></p>
                        </div>
                      </div>
                      <div className="row mb-4">
                        <div className="col-md-7">
                          <p className="text-muted"> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris blandit nisl ullamcorper, rutrum metus in, congue lectus. In hac habitasse platea dictumst. Cras urna quam, malesuada vitae risus at, pretium blandit sapien. </p>
                        </div>
                        <div className="col">
                          <p className="small mb-0 text-muted">Yazılım Depertmanı</p>
                          <p className="small mb-0 text-muted">Yazılım Takım Lideri</p>
                          <p className="small mb-0 text-muted">(537) 315-1481</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr className="my-4" />
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <label htmlFor="firstname">İsim ve Soyisim</label>
                      <input disabled type="text" id="firstname" className="form-control" placeholder="Brown" />
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="inputEmail4">Email</label>
                    <input disabled type="email" className="form-control" id="inputEmail4" placeholder="brown@asher.me" />
                    </div>
                  </div>
                 <div className="form-row">
                    <div className="form-group col-md-6">
                      <label htmlFor="firstname">Telefon nu</label>
                      <input disabled type="text" id="firstname" className="form-control" placeholder="Brown" />
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="inputEmail4">Doğum tarihi :</label>
                    <input disabled type="date" className="form-control" id="inputEmail4" placeholder="2000-05-05" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="inputAddress5">Adres</label>
                    <input disabled type="text" className="form-control" id="inputAddress5" placeholder="P.O. Box 464, 5975 Eget Avenue" />
                  </div>
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <label htmlFor="inputCompany5">Memleketi</label>
                      <input disabled type="text" className="form-control" id="inputCompany5" placeholder="Nec Urna Suscipit Ltd" />
                    </div>
                    <div className="form-group col-md-4">
                      <label htmlFor="inputState5">Ülke</label>
                      <select disabled  id="inputState5" className="form-control">
                        <option defaultValue="">Choose...</option>
                        <option>...</option>
                      </select>
                    </div>
                    <div className="form-group col-md-2">
                      <label htmlFor="inputZip5">Posta Kodu</label>
                      <input disabled type="text" className="form-control" id="inputZip5" placeholder="98232" />
                    </div>
                  </div>
                  <hr className="my-4" />
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="inputPassword4">Yönetici Şifresi</label>
                        <input type="password" className="form-control" id="inputPassword5" />
                      </div>
                      <div className="form-group">
                        <label htmlFor="inputPassword5">Yeni Şifre</label>
                        <input disabled type="password" className="form-control" id="inputPassword5" />
                      </div>
                      <div className="form-group">
                        <label htmlFor="inputPassword6">Yeni Şifre Onayla</label>
                        <input disabled type="password" className="form-control" id="inputPassword6" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <p className="mb-2">Yeni Şifre Gereklilikleri</p>
                     
                      <ul className="small text-muted pl-4 mb-0">
                        <li> Minimum 8 karakter </li>
                        <li>Mutlaka büyük harfle başlamalı</li>
                        <li>Mutlaka rakam içermeli</li>
                        <li>Önceki şifre ile aynı olamaz </li>
                      </ul>
                    </div>
                  </div>
                  <button type="submit" className="col-md-12 btn btn-success">Bilgileri Güncelle</button>
             
              </div> 
            </div> 
          </div> 
        </div>
  )
}

export default page
