
import React from 'react'

const page = () => {



  const users = [
    {
      namesurname:"Ahmet Kar",
      telephone:"05461652121",
      department:"HR",
      position:"Manager",
      signupdate:"02-02-2026"
    },
    {
      namesurname:"Ahmet Kar",
      telephone:"05461652121",
      department:"HR",
      position:"Manager",
      signupdate:"02-02-2026"
    },
    {
      namesurname:"Ahmet Kar",
      telephone:"05461652121",
      department:"HR",
      position:"Manager",
      signupdate:"02-02-2026"
    },
    {
      namesurname:"Ahmet Kar",
      telephone:"05461652121",
      department:"HR",
      position:"Manager",
      signupdate:"02-02-2026"
    },
    {
      namesurname:"Ahmet Kar",
      telephone:"05461652121",
      department:"HR",
      position:"Manager",
      signupdate:"02-02-2026"
    }
  ]



  return (
    <div>
          <div className="row justify-content-center">
            <div className="col-12">
              <h2 className="mb-2 page-title">Kullanıcılar</h2>
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
                            <th>Telefon</th>
                            <th>Departman</th>
                            <th>Pozisyon</th>
                            <th>Kayıt tarihi</th>
                            <th>Action</th>
                            <th>Ülke</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(users.map((u)=>(
  <tr>
                            <td>
                              <div className="custom-control custom-checkbox">
                                <input type="checkbox" className="custom-control-input" />
                                <label className="custom-control-label"></label>
                              </div>
                            </td>
                            <td>368</td>
                            <td>{u.namesurname}</td>
                            <td>{u.telephone}</td>
                            <td>{u.department}</td>
                            <td>{u.position}</td>
                           <td>{u.signupdate}</td>
                            
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
                          )))}
                         
                         
                          
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
