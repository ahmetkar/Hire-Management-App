"use client"
import { getJobs,Job } from '@/app/lists/jobs';
import React, { useEffect, useState } from 'react'

const page = () => {


   const [jobs, setJobs] = useState<Job[]>([]);

   useEffect(() => {
      getJobs()
        .then((data) => setJobs(data))
        .catch((error) => console.error(error));   
    }, []);


  return (
    <div>
          <div className="row justify-content-center">
            <div className="col-12">
              <h2 className="mb-2 page-title">İş Listesi</h2>
              <p className="card-text"></p>
              <div className="row my-4">
              
                <div className="col-md-12">
                  <div className="card shadow">
                    <div className="card-body">
               
                      <table className="table datatables" id="dataTable-1">
                        <thead>
                          <tr>
                            <th></th>
                            <th>#</th>
                            <th>İş İlanı Başlığı</th>
                            <th>Departman</th>
                            <th>Pozisyon Başlığı</th>
                            <th>Oluşturulma tarihi</th>
                            <th>Bitiş Tarihi</th>
                            <th>İş gereklilikleri</th>
                            <th>Notlar</th>
                            <th>Sorumlu Kişi</th>
                            <th>Oluşturuan Kişi</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {jobs.map((s)=>(
                           <tr key={s.id}>
                            <td>
                              <div className="custom-control custom-checkbox">
                                <input type="checkbox" className="custom-control-input" />
                                <label className="custom-control-label"></label>
                              </div>
                            </td>
                            <td>{s.id.substring(0,5)}...</td>
                            <td>{s.jobtitle}</td>
                            <td>{s.department}</td>
                            <td>{s.position}</td>
                            <td>{s.createdate.toString()}</td>
                            <td>{s.expiredate.toString()}</td>
                            <td>{s.jobrequirements}</td>
                            <td>{s.jobnotes}</td>
                            <td>{s.responsibleUserId.substring(0,5)}</td>
                            <td>{s.createdByUserId.substring(0,5)}</td>
                            <td><button className="btn btn-sm dropdown-toggle more-horizontal" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span className="text-muted sr-only">Action</span>
                              </button>
                              <div className="dropdown-menu dropdown-menu-right">
                                <a className="dropdown-item" href={`/application/jobmanagement/updatejob/${s.id}`}>Güncelle</a>
                                <a className="dropdown-item" href="#">Sil</a>
                               
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
