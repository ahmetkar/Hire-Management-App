"use client";
import Modal from '@/app/components/Modal';
import { DepartmentResponse, getDepartments } from '@/app/lists/department';
import axiosInstance from '@/app/utils/axiosInstance';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function Page() {


 
   const defaultLimit = 4
  

    const [showSuccessModal,setShowSuccessModal] = useState(false)
    const [showFailureModal,setShowFailureModal] = useState(false)
    const [successTitle,setSuccessTitle] = useState("")
    const [failureTitle,setFailureTitle] = useState("")
    const [failureDesc,setFailureDesc] = useState("")
    const [successDesc,setSuccessDesc] = useState("")
  
    const [departments,setDepartments] = useState<DepartmentResponse>({
          data:[],
          total: 0,
          page: 1,
          limit: defaultLimit,
          totalPages: 0,
       });
       const params =  useSearchParams()

       const page = Number(params.get("page")) || 1
       const limit = Number(params.get("limit") || defaultLimit)

  
       useEffect(() => {
          
          getDepartments(page,limit)
            .then((data) => setDepartments(data))
            .catch((error) => console.error(error));  
          
         
        }, [page,limit]);

        

        const deleteDepartment = async (id:string)=>{
            const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/job/delete-department/${id}`)
            if(response.status==201){
                setSuccessTitle("Başarıyla silindi")
                setSuccessDesc("İstediğiniz departman silindi.")
                setShowSuccessModal(true)
            }else {
                setFailureTitle("Başarıyla silindi")
                setFailureDesc("İstediğiniz departman silindi.")
                setShowFailureModal(true)
            }
        }



  return (
    <div>
       <Modal show={showSuccessModal} title={successTitle} message={successDesc}
                                          confirmText='' cancelText='Tamam' setConfirm={false} onConfirm={()=>{}} onCancel={()=>setShowSuccessModal(false)} />
              <Modal show={showFailureModal} title={failureTitle} message={failureDesc}
                                          confirmText='' cancelText='Tamam' setConfirm={false} onConfirm={()=>{}} onCancel={()=>setShowFailureModal(false)} />
      
              
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
                          {departments.data.map((dep)=>(
                            <tr key={dep.id}>
                            <td>
                              <div className="custom-control custom-checkbox">
                                <input type="checkbox" className="custom-control-input" />
                                <label className="custom-control-label"></label>
                              </div>
                            </td>
                            <td>{dep.name}</td>
                            <td>{dep.addingdate.toISOString()}</td>
                            <td><button className="btn btn-sm dropdown-toggle more-horizontal" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span className="text-muted sr-only">Action</span>
                              </button>
                              <div className="dropdown-menu dropdown-menu-right">
                                <a href={`application/department/updatedepartment/${dep.id}`} className="dropdown-item">Düzenle</a>
                                <a onClick={()=>deleteDepartment(dep.id)} className="dropdown-item" href="#">Sil</a>
                               
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

