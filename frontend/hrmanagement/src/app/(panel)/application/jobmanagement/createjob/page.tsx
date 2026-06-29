"use client";
import React, { useEffect, useState } from 'react'

import { Department,getDepartments } from '../../datas/departments'

import { User,getUsers } from '../../datas/users'



const page = () => {

    const [departments, setDepartments] = useState<Department[]>([]);
    const [users, setUsers] = useState<User[]>([]);


     useEffect(() => {
        getDepartments()
          .then((data) => setDepartments(data))
          .catch((error) => console.error(error));

          getUsers()
          .then((data) => setUsers(data))
          .catch((error) => console.error(error));

     },[]);

   
    /**
     *id String @id @default(auto()) @map("_id") @db.ObjectId
    jobtitle String
    jobrequirements String
    jobnotes  String
    department String
    position String
    mounthlywage    Int?
    weeklypayment   Int?
    dailypayment    Int?
    createdate  DateTime @default(now())
    expiredate  DateTime
    responsibleUserId String?
     */
  return (
     <div>

          <div className="row justify-content-center">
            <div className="col-12">
              <h2 className="page-title">Yeni İş İlanı Ekle</h2>
             
              <div className="card shadow mb-4">
                
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label htmlFor="simpleinput">İş İlanı Başlığı : </label>
                        <input type="text" id="simpleinput" className="form-control" />
                      </div>
                      <div className="form-group mb-3">
                        <label htmlFor="example-email">Pozisyon Adı :</label>
                        <input type="email" id="example-email" name="example-email" className="form-control" placeholder="Email" />
                      </div>
                     
                      <div className="form-group mb-3">
                        <label htmlFor="example-palaceholder">Varsa Aylık Maaş :</label>
                        <input className="form-control input-phoneus" id="custom-phone" placeholder="..." />
                      </div>

                         <div className="form-group mb-3">
                        <label htmlFor="example-palaceholder">Varsa Haftalık Maaş :</label>
                        <input className="form-control input-phoneus" id="custom-phone" placeholder="..." />
                      </div>
                    </div> 
                    <div className="col-md-6">
                      
                         <div className="form-group mb-3">
                        <label htmlFor="example-palaceholder">Varsa Günlük Ücret :</label>
                        <input className="form-control input-phoneus" id="custom-phone" placeholder="..." />
                      </div>
                        <div className="form-group mb-3">
                          <label htmlFor="simple-select2">Ait olduğu departman : </label>
                          <select className="form-control" id="simple-select2">
                            <optgroup label="">
                              {departments.map((dep,index)=>(
                                <option key={index} value={`${dep.name}`}>{dep.name}</option>
                              ))}  
                              
                
                            </optgroup>
                          
                          </select>

                          
                     </div>

                      <div className="form-group mb-3">
                          <label htmlFor="simple-select2">Sorumlu Eleman : </label>
                          <select className="form-control" id="simple-select2">
                            <optgroup label="">
                                {users.map((us,index)=>(
                                <option key={index} value={`${us.id}`}>{us.name}</option>
                              ))}  
                
                            </optgroup>
                          
                          </select>

                          
                     </div>

                      
                      
                      <div className="form-group mb-3">
                        <label htmlFor="example-disable">İlan bitiş tarihi : </label>
                        <input className="form-control" id="example-date" type="date" name="date" />
                      </div>
                     
                    </div>
                  </div>
                  <div className="row">
                    <div className='col-md-12'>
                        <div className="form-group mb-3">
                        <label htmlFor="example-palaceholder">İş gereksinimleri(araya virgül koyarak) :</label>
                        <textarea className="form-control input-phoneus" id="custom-phone" placeholder="..." />
                      </div>

                       <div className="form-group mb-3">
                        <label htmlFor="example-palaceholder">İlan Açıklaması :</label>
                        <textarea className="form-control input-phoneus" id="custom-phone" placeholder="..." />
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
