import React from 'react'

const page = () => {

  const staff = [
    {
      id:"5445",
      namesurname:"Ahmet Kar",
      telno:"05461213312",
      department:"HR",
      position:"Staff",
      address:"Gul mah. 14000 nolu sk No 15 Sahinbey/Gaziantep",
      jobenterdate:"02-02-2026"
    },
     {
      id:"5444",
      namesurname:"Ahmet Kar",
      telno:"05461213312",
      department:"HR",
      position:"Staff",
      address:"Gul mah. 14000 nolu sk No 15 Sahinbey/Gaziantep",
      jobenterdate:"02-02-2026"
    },
     {
      id:"5447",
      namesurname:"Ahmet Kar",
      telno:"05461213312",
      department:"HR",
      position:"Staff",
      address:"Gul mah. 14000 nolu sk No 15 Sahinbey/Gaziantep",
      jobenterdate:"02-02-2026"
    },
     {
      id:"5446",
      namesurname:"Ahmet Kar",
      telno:"05461213312",
      department:"HR",
      position:"Staff",
      address:"Gul mah. 14000 nolu sk No 15 Sahinbey/Gaziantep",
      jobenterdate:"02-02-2026"
    },
     {
      id:"5443",
      namesurname:"Ahmet Kar",
      telno:"05461213312",
      department:"HR",
      position:"Staff",
      address:"Gul mah. 14000 nolu sk No 15 Sahinbey/Gaziantep",
      jobenterdate:"02-02-2026"
    },
     {
      id:"5442",
      namesurname:"Ahmet Kar",
      telno:"05461213312",
      department:"HR",
      position:"Staff",
      address:"Gul mah. 14000 nolu sk No 15 Sahinbey/Gaziantep",
      jobenterdate:"02-02-2026"
    }
  ]
  return (
    <div>
          <div className="row justify-content-center">
            <div className="col-12">
              <h2 className="mb-2 page-title">İş Listesi</h2>
              <p className="card-text">DataTables is a plug-in for the jQuery Javascript library. It is a highly flexible tool, built upon the foundations of progressive enhancement, that adds all of these advanced features to any HTML table. </p>
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
                            <th>Telefon nu</th>
                            <th>Departman</th>
                            <th>Pozisyon</th>
                            <th>Adres</th>
                            <th>İşe Giriş Tarihi</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {staff.map((s)=>(
                           <tr key={s.id}>
                            <td>
                              <div className="custom-control custom-checkbox">
                                <input type="checkbox" className="custom-control-input" />
                                <label className="custom-control-label"></label>
                              </div>
                            </td>
                            <td>{s.id}</td>
                            <td>{s.namesurname}</td>
                            <td>{s.telno}</td>
                            <td>{s.department}</td>
                            <td>{s.position}</td>
                            <td>{s.address}</td>
                            
                            <td>{s.jobenterdate}</td>
                            <td><button className="btn btn-sm dropdown-toggle more-horizontal" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span className="text-muted sr-only">Action</span>
                              </button>
                              <div className="dropdown-menu dropdown-menu-right">
                                <a className="dropdown-item" href="#">Edit</a>
                                <a className="dropdown-item" href="#">Remove</a>
                                <a className="dropdown-item" href="#">Assign</a>
                              </div>
                            </td>
                          </tr>
                          ))}
                          
                          
                          
                        </tbody>
                      </table>
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
