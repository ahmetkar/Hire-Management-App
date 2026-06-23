"use client"
import { useParams } from 'next/navigation'
import React from 'react'

const page =  () => {

  const params = useParams<{ id: string }>();
  return (
   <div>
          <div className="row justify-content-center">

            <div className="col-12">
              <h2 className="page-title">{params.id} id li departman güncelleme</h2>
              <p className="text-muted"></p>
              <div className="card shadow mb-4">
                <div className="card-header">
                  <strong className="card-title"></strong>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group mb-3">
                        <label htmlFor="simpleinput">Departman Adı : </label>
                        <input type="text" id="simpleinput" className="form-control" />
                      </div>
                     
                      
                    </div> 
                   
                  </div>
                </div>
              </div> 
            
            </div> 

          </div> 

          
               <div className="row mb-4">
                <div className="col-md-12">
                    
                        <button className="col-md-12 btn btn-primary" type="submit">Ekle</button>
                </div>
               </div>


        </div>
  )
}

export default page
