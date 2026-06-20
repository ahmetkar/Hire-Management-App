import React from 'react'

const page = () => {




 
  const userapplications = [
    {
      id:"565",
      namesurname:"Ahmet Kar",
      jobtitle:"Bilgisayar Mühendisi",
      graduteyear:"2024",
      telno:"05461653232",
      city:"Gaziantep",
      application: {
        applicationname:"Backend Developer İlanı",
        applicationdesc:"...............",
        applicationid:"1545"
      },
      summary:"Egestas integer eget aliquet nibh praesent. In hac habitasse platea dictumst quisque sagittis purus.",
      date:"02-02-2026",
      status:"pending"
    },
    {
      id:"565",
      namesurname:"Ahmet Kar",
      jobtitle:"Bilgisayar Mühendisi",
      graduteyear:"2024",
      telno:"05461653232",
      city:"Gaziantep",
      application: {
        applicationname:"Backend Developer İlanı",
        applicationdesc:"...............",
        applicationid:"1545"
      },
      summary:"Egestas integer eget aliquet nibh praesent. In hac habitasse platea dictumst quisque sagittis purus.",
      date:"02-02-2026",
      status:"pending"
    },
    {
      id:"565",
      namesurname:"Ahmet Kar",
      jobtitle:"Bilgisayar Mühendisi",
      graduteyear:"2024",
      telno:"05461653232",
      city:"Gaziantep",
      application: {
        applicationname:"Backend Developer İlanı",
        applicationdesc:"...............",
        applicationid:"1545"
      },
      summary:"Egestas integer eget aliquet nibh praesent. In hac habitasse platea dictumst quisque sagittis purus.",
      date:"02-02-2026",
      status:"pending"
    },
    {
      id:"565",
      namesurname:"Ahmet Kar",
      jobtitle:"Bilgisayar Mühendisi",
      graduteyear:"2024",
      telno:"05461653232",
      city:"Gaziantep",
      application: {
        applicationname:"Backend Developer İlanı",
        applicationdesc:"...............",
        applicationid:"1545"
      },
      summary:"Egestas integer eget aliquet nibh praesent. In hac habitasse platea dictumst quisque sagittis purus.",
      date:"02-02-2026",
      status:"pending"
    }
  ]

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
                              <select className="custom-select mr-sm-2" id="inlineFormCustomSelectPref1">
                                <option value="">...</option>
                                <option value="1">12</option>
                                <option value="2" selected>32</option>
                                <option value="3">64</option>
                                <option value="3">128</option>
                              </select>
                            </div>
                             <div className="form-group col-auto ml-3">
                                <label className="my-1 mr-2 sr-only" htmlFor="inlineFormCustomSelectPref">Status</label>
                                <select className="custom-select my-1 mr-sm-2" id="inlineFormCustomSelectPref">
                                  <option selected>Choose...</option>
                                  <option value="1">Yeni Başvuru</option>
                                  <option value="2">Yönetici Onayı Bekliyor</option>
                                  <option value="3">Onaylanan</option>
                                  <option value="3">Reddedilen</option>
                                </select>
                              </div>
                            <div className="form-group col-auto">
                              <label htmlFor="search" className="sr-only">Search</label>
                              <input type="text" className="form-control" id="search1" value="" placeholder="Search" />
                            </div>
                          </div>
                        </form>
                      </div>
                     
                      <table className="table table-borderless table-hover">
                        <thead>
                          <tr>
                            <td>
                              <div className="custom-control custom-checkbox">
                                <input type="checkbox" className="custom-control-input" id="all2" />
                                <label className="custom-control-label" htmlFor="all2"></label>
                              </div>
                            </td>
                            <th>ID</th>
                            <th>İsim/Soyisim/Mezuniyet</th>
                            <th>İlan Detayları</th>
                            <th>İletişim Bilgileri</th>
                            <th className="w-25">Başvuru Özeti</th>
                            <th>Başvuru Tarihi</th>
                            <th>Durum</th>
                            <th>Aksiyonlar</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userapplications.map((uap)=>(
                               <tr>
                            <td>
                              <div className="custom-control custom-checkbox">
                                <input type="checkbox" className="custom-control-input" id="2474" />
                                <label className="custom-control-label" htmlFor="2474"></label>
                              </div>
                            </td>
                            <td>
                                {/* 
                                <div className="avatar avatar-md">
                                <img src="./assets/avatars/face-1.jpg" alt="..." className="avatar-img rounded-circle">
                              </div>
                                */}
                               <small className="mb-0 text-muted">#{uap.id}</small>
                            </td>
                            <td>
                              <p className="mb-0 text-muted"><strong>{uap.namesurname}</strong></p>
                              <small className="mb-0 text-muted">{uap.jobtitle}</small>
                            </td>
                            <td>
                              <p className="mb-0 text-muted">{uap.application.applicationname}</p>
                              <small className="mb-0 text-muted">İlan Id : #{uap.application.applicationid}</small>
                            </td>
                            <td>
                              <p className="mb-0 text-muted"><a href="#" className="text-muted">{uap.telno}</a></p>
                              <small className="mb-0 text-muted">{uap.city}
                              </small>
                            </td>
                            <td className="w-25"><small className="text-muted"> {uap.summary}</small></td>
                            <td className="text-muted">{uap.date}</td>
                            <td>{uap.status == "pending" ? "Onay Bekliyor" : "Yeni Başvuru"}</td>
                            <td><button className="btn btn-sm dropdown-toggle more-horizontal" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span className="text-muted sr-only">Aksiyonlar</span>
                              </button>
                              <div className="dropdown-menu dropdown-menu-right">
                            
                                <a className="dropdown-item" href="#">İncele</a>
                                <a className="dropdown-item" href="#">Direk Reddet</a>
                              </div>
                            </td>
                          </tr>
                          ))}
                         


                        </tbody>
                      </table>
                      <nav aria-label="Table Paging" className="mb-0 text-muted">
                        <ul className="pagination justify-content-center mb-0">
                          <li className="page-item"><a className="page-link" href="#">Previous</a></li>
                          <li className="page-item"><a className="page-link" href="#">1</a></li>
                          <li className="page-item active"><a className="page-link" href="#">2</a></li>
                          <li className="page-item"><a className="page-link" href="#">3</a></li>
                          <li className="page-item"><a className="page-link" href="#">Next</a></li>
                        </ul>
                      </nav>
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
