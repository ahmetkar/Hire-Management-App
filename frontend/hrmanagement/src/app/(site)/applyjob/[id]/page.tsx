"use client"
import React, { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import {getUniversities,University} from '../../lists/university';
import {getCities,City} from '../../lists/cities';
import {getCounties,County} from '../../lists/counties';
import { getDepartments } from '../../lists/unidepartments';
import { getJobInfos } from '../../lists/jobs';



const page = () => {


  const {id} = useParams()
  console.log(id)
  

   const [universities, setUniversities] = useState<University[]>([]);
   const [cities, setCities] = useState<City[]>([]);
   const [cityPlate,setCityPlate] = useState<number>(0)
   const [counties, setCounties] = useState<County[]>([]);
   const [departments, setDepartments] = useState<string[]>([]);
   const [abilities, setAbilities] = useState<string[]>([]);
   const [position,setPosition] = useState<string>("");

  useEffect(() => {
    getUniversities()
      .then((data) => setUniversities(data))
      .catch((error) => console.error(error));

    getCities()
      .then((data) => setCities(data))
      .catch((error) => console.error(error));

    getDepartments()
      .then((data) => setDepartments(data))
      .catch((error) => console.error(error));

    if(id != null){
      getJobInfos(id.toString())
        .then((data) => {
          console.log(data)
          if(data !=undefined){
            console.log(data)
            const list = data[0].split(",")
            setAbilities(list)
            setPosition(data[1])
          }
        })
        .catch((error) => console.error(error));
    }

  }, []);


  useEffect(() => { 

    if(cityPlate != 0){
      console.log(cityPlate)
      getCounties(cityPlate)
      .then((data) => setCounties(data))
      .catch((error) => console.error(error));
     }
     
   }, [cityPlate]);


   


  type FormData = {
      jobid:string;
      name:string;
      phone_number:string;
      birthdate:string;
      email:string;
      university:string;
      unidepartment:string;
      graduatedate:string;
      address:string;
      city:string;
      country:string;
      position:string;
      county:string;
      zipcode:string;
      githublink:string;
      linkedinlink:string;
      abilities:string[];
      selfbio:string;
      agreeterms:boolean;
      ipaddress:string;
  };


  const [serverError,setServerError] = useState<string | null>(null)


  const router = useRouter()

    
   const {register,handleSubmit,setValue,formState:{errors}} = useForm<FormData>({
    defaultValues:{
      abilities:[]
    }
   });

  const onSubmit = (data:FormData) => {
    addJobMutation.mutate(data)
  };

  const addJobMutation = useMutation({
    mutationFn: async (data:FormData) => {
        if(id != undefined){
          console.log(data.abilities)
          data.jobid = id as string;
          data.country = "tr"
          data.position = position
          data.birthdate = data.birthdate ? new Date(`${data.birthdate}T00:00:00.000Z`).toISOString(): ""
          data.graduatedate = data.graduatedate ? new Date(`${data.graduatedate}T00:00:00.000Z`).toISOString(): ""

          const citystr = cities.find((city)=> city.plateCode == data.city)
          data.city = citystr!.name
          const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/job/create-job-application`,data)
          return response.data
        } 

    },
    onSuccess:(data)=>{
        setServerError(null);
        console.log(data)
        router.push("/success")
    
    },
    onError: (error:AxiosError) => {
        const errorMsg = (error.response?.data as {message?:string})?.message || "Başvuru gönderilemedi"
        console.log(errorMsg)
        setServerError(errorMsg);
    }
    
  })


  return (
    <div>
      

       <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row justify-content-center">
            <div className="col-12">
              <h2 className="page-title">İş Başvurusu Yapın</h2>
              <p className="text-muted">{position ? position : ""} Pozisyonu İçin İş Başvurusu formu.</p>
              <p className='text-red-500 text-sm'>{String(serverError==null ? "" : serverError)}</p><br /><br />
              <div className="card shadow mb-4">
                <div className="card-header">
                  <strong className="card-title">Temel Bilgiler</strong>
                </div>
                <div className="card-body">
                  <div className="row">
                   
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label htmlFor="simpleinput">Ad ve Soyad</label>
                        <input type="text" id="simpleinput" className="form-control"
                         {...register("name",{required: "İsim ve soyisim gereklidir.."})}
                         
                        />
                         {errors.name && (
                        <p className='text-red-500 text-sm'>{String(errors.name.message)}</p>
                          )}
                      </div>
                      <div className="form-group mb-3">
                        <label htmlFor="example-email">Email</label>
                        <input type="email" id="example-email"  className="form-control" placeholder="Email" 
                         {...register("email",{required: "Email gereklidir.",pattern : {
                            value:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                            message:"Geçersiz email"
                        }})}
                        />
                         {errors.email && (
                        <p className='text-red-500 text-sm'>{String(errors.email.message)}</p>
                        )}
                      </div>
                     
                      <div className="form-group mb-3">
                        <label htmlFor="example-palaceholder">Telefon numarası :</label>
                        <input className="form-control input-phoneus" id="custom-phone" placeholder="(987) 654-3210" 
                         {...register("phone_number",{required: "Telefon nu gereklidir."})}
                        />
                         {errors.phone_number && (
                        <p className='text-red-500 text-sm'>{String(errors.phone_number.message)}</p>
                          )
                          }
                      </div>

                        <div className="form-group mb-3">
                        <label htmlFor="example-palaceholder">Doğum tarihi</label>
                        <input className="form-control" id="example-date" type="date" 
                        {...register("birthdate",{required: "Doğum tarihi gereklidir."})}
                        />
                         {errors.birthdate && (
                        <p className='text-red-500 text-sm'>{String(errors.birthdate.message)}</p>
                    )
                    }
                      </div>
                    </div> 
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                      
                          <label htmlFor="simple-select2">Mezun olduğunuz üniversite </label>
                          <select className="form-control" id="simple-select2"
                          {...register("university")}
                          >
                            <optgroup label="">
                              {universities.map((uni,index)=>(
                              <option key={`${uni.name,index}`} value={`${uni.name}`}>{uni.name}</option>
                           ))}
                            </optgroup>
                          </select>
                           {errors.university && (
                        <p className='text-red-500 text-sm'>{String(errors.university.message)}</p>
                          )}
                     </div>
                      <div className="form-group mb-3">
                          <label htmlFor="simple-select">Bölümünüz </label>
                          <select className="form-control" id="simple-select"
                          {...register("unidepartment")}
                          >
                             <optgroup label="">
                              {departments.map((dep,index)=>(
                              <option key={`${dep}`} value={`${dep}`}>{dep}</option>
                           ))}
                            </optgroup>
                          </select>
                           {errors.unidepartment && (
                        <p className='text-red-500 text-sm'>{String(errors.unidepartment.message)}</p>
                    )
                    }
                     </div>
                      <div className="form-group mb-3">
                        <label htmlFor="example-disable">Mezuniyet tarihi</label>
                        <input className="form-control" id="example-date" type="date"
                        {...register("graduatedate")}
                        />
                         {errors.graduatedate && (
                        <p className='text-red-500 text-sm'>{String(errors.graduatedate.message)}</p>
                          )
                          }
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
                          <input type="text" id="address-wpalaceholder" className="form-control" placeholder="Adresinizi girin :"
                          {...register("address",{required: "Adres gereklidir."})}
                          />
                          <div className="valid-feedback"> Looks good! </div>
                          <div className="invalid-feedback"> 
                             {errors.address && (
                        <p className='text-red-500 text-sm'>{String(errors.address.message)}</p>
                              )
                              }
                             </div>
                        </div>

                        <div className="col-md-12 form-row">
                          <div className="col-md-6 mb-3">
                            <label htmlFor="validationSelect2">Yaşadığınız Şehir</label>
                            <select className="form-control" id="validationSelect2" 
                            {...register("city",{required: "Şehir gereklidir.",onChange: (e)=>{

                              
                                setCityPlate(Number(e.target.value))
                                
                                
                            }})}
                            >
                            <option value=""></option>
                             <optgroup label="">
                              {cities.map((city,index)=>(
                              <option key={`${city.plateCode}`} value={`${city.plateCode}`}>{city.name}</option>
                           ))}
                            </optgroup>
                              
                            </select>
                            <div className="invalid-feedback"> 
                               {errors.city && (
                        <p className='text-red-500 text-sm'>{String(errors.city.message)}</p>
                    )
                    }
                               </div>
                          </div>
                          <div className="col-md-3 mb-3">
                            <label htmlFor="validationCustom33">Yaşadığınız İlçe</label>
                             <select className="form-control" id="validationSelect2" 
                            {...register("county",{required: "İlçe gereklidir."})}
                            >
                            <option value="">İlçe Seç</option>
                             <optgroup label="">
                              {counties.map((county,index)=>(
                              <option  key={`${county.ilce_id}`} value={`${county.ilce_adi}`}>{county.ilce_adi}</option>
                           ))}
                            </optgroup>
                              
                            </select>
                            <div className="invalid-feedback"> 
                               {errors.county && (
                        <p className='text-red-500 text-sm'>{String(errors.county.message)}</p>
                    )
                    }
                               </div>
                          </div>
                          
                          <div className="col-md-3 mb-3">
                            <label htmlFor="custom-zip">Posta kodu</label>
                            <input className="form-control input-zip" id="custom-zip" autoComplete="false" maxLength={9} 
                            {...register("zipcode",{required: "Posta kodu gereklidir."})}
                            />
                            <div className="invalid-feedback"> 
                             {errors.zipcode && (
                        <p className='text-red-500 text-sm'>{String(errors.zipcode.message)}</p>
                    )
                    }
                             </div>
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
                          <input type="text" id="simpleinput" className="form-control"
                          {...register("githublink")}
                          />
                           {errors.githublink && (
                        <p className='text-red-500 text-sm'>{String(errors.githublink.message)}</p>
                    )
                    }
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label htmlFor="simpleinput">Linkedin Linki </label>
                          <input type="text" id="simpleinput" className="form-control" 
                          {...register("linkedinlink")}
                          />
                           {errors.linkedinlink && (
                        <p className='text-red-500 text-sm'>{String(errors.linkedinlink.message)}</p>
                    )
                    }
                      </div>
                    </div>

                    <div className="col-md-12">
                       <label htmlFor="multi-select2">Yeteneklerinizi Seçin : </label>
                            <div className="d-flex flex-wrap">
                              {abilities.map((ability, index) => (
                                <label
                                  key={ability}
                                  htmlFor={`ability-${index}`}
                                  className="border rounded px-4 py-3 mr-2 mb-2 d-flex align-items-center"
                                  style={{ cursor: "pointer" }}
                                >
                                  <input
                                    id={`ability-${index}`}
                                    type="checkbox"
                                    className="form-check-input position-static mr-2"
                                    value={ability}
                                    {...register("abilities", {
                                      required: "En az bir yetenek seçmelisiniz.",
                                    })}
                                  />

                                  <span>{ability}</span>
                                </label>
                              ))}
                            </div>
                           {errors.abilities && (
                        <p className='text-red-500 text-sm'>{String(errors.abilities.message)}</p>
                    )
                    }
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
                          <textarea className="form-control" id="validationTextarea1" placeholder="Take a note here" required rows={3}
                          {...register("selfbio")}
                          ></textarea>
                          <div className="invalid-feedback">
                             {errors.selfbio && (
                        <p className='text-red-500 text-sm'>{String(errors.selfbio.message)}</p>
                            )
                            }  
                          </div>
                    </div>
                  </div>
                </div>
              </div> 


               <div className="row mb-4">
                <div className="col-md-12">
                    <div className="form-group">
                          <div className="form-check">
                            <input className="form-check-input" type="checkbox" value="" id="invalidCheck" 
                            {...register("agreeterms",{required: "Bu seçenek kayıt olmak için zorunludur."})}
                            />
                            <label className="form-check-label" htmlFor="invalidCheck"> Kişisel Bilgilerimin İşlenmesini ve Kaydedilmesini, Email,Sms almayı Kabul Ediyorum. </label>
                            <div className="invalid-feedback">
                             {errors.agreeterms && (
                        <p className='text-red-500 text-sm'>{String(errors.agreeterms.message)}</p>
                    )
                    }  
                            </div>
                          </div>
                        </div>
                        <button className="col-md-12 btn btn-primary" type="submit">Başvuru yap</button>
                </div>
               </div>

      
    </form>
    </div>
  )
}

export default page
