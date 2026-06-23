"use client";
import router from 'next/router';
import React, { useState } from 'react'

export default function page() {


  const [selectedId,setSelectedId] = useState("")

  const departments = [
    {
    id:"45454",
    name: "deneme",
    date: "08/02/2026",
    },
    {
    id:"45451",
    name: "deneme 2",
    date: "08/02/2026",
    },
    {
    id:"45452",
    name: "deneme 3",
    date: "08/02/2026",
    },
    {
    id:"45450",
    name: "deneme 4",
    date: "08/02/2026",
    },
  ]

  return (
    <div>
          <div className="row justify-content-center">
            <div className="col-12">
              <h2 className="mb-2 page-title">Departmanlar</h2>
              
              <div className="row my-4">
              
                <div className="col-md-12">
                  <div className="card shadow">
                    <div className="card-body">
               
                      <table className="table datatables" id="dataTable-1">
                        <thead>
                          <tr>
                            <th></th>
                         
                            <th>Departman Adı</th>
                            <th>Eklenme Tarihi</th>
                            <th>Aksiyonlar</th>
                          </tr>
                        </thead>
                        <tbody>
                          {departments.map((dep)=>(
                            <tr key={dep.id}>
                            <td>
                              <div className="custom-control custom-checkbox">
                                <input type="checkbox" className="custom-control-input" />
                                <label className="custom-control-label"></label>
                              </div>
                            </td>
                            <td>{dep.name}</td>
                            <td>{dep.date}</td>
                            <td><button onClick={()=>{setSelectedId(dep.id)}} className="btn btn-sm dropdown-toggle more-horizontal" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span className="text-muted sr-only">Action</span>
                              </button>
                              <div className="dropdown-menu dropdown-menu-right">
                                <a href={`application/department/updatedepartment/${dep.id}`} className="dropdown-item">Edit</a>
                                <a className="dropdown-item" href="#">Remove</a>
                               
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

