"use client";
import { City, getCities } from '@/app/lists/cities';
import { County, getCounties } from '@/app/lists/counties';
import { getJobInfos, getJobs,JobsResponse } from '@/app/lists/jobs';
import { getDepartments } from '@/app/lists/unidepartments';
import { getUniversities, University } from '@/app/lists/university';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import axiosInstance from '@/app/utils/axiosInstance';
import { getStaff, getStaffAndUser, getUser, Staff, StaffUser, User } from '@/app/lists/datas/users';
import { Department,getDepartments as getDepartments1 } from '@/app/lists/department';

const Page = () => {

  const {id} = useParams()

  console.log(id)
  

  const [stage,setStage] = useState("")
   const [universities, setUniversities] = useState<University[]>([]);
    const [departments1, setDepartments1] = useState<Department[]>([]);
     const [cities, setCities] = useState<City[]>([]);
     const [cityPlate,setCityPlate] = useState<number>(0)
     const [counties, setCounties] = useState<County[]>([]);
     const [departments, setDepartments] = useState<string[]>([]);
     const [abilities, setAbilities] = useState<string[]>([]);
     const [activeAbilities, setActiveAbilities] = useState<string[]>([]);
     const [jobs, setJobs] = useState<JobsResponse>();
     const [user, setUser] = useState<Staff >();
     const [job,setJob] = useState("")
  
     const [aiResponseForStaff,setAIResponseForStaff] = useState<string>("")

    const [found,setFound] = useState<boolean>(false);

    


      type StaffFormData = {
      staffId:string;
      name:string;
      email:string;
      phone_number:string;
      birthdate:string;
      university:string;
      unidepartment:string;
      graduatedate:string;
      address:string;
      city:string;
      country:string;
      jobId:string;
      county:string;
      postcode:string;
      githublink:string;
      linkedinlink:string;
      abilities:string[];
      selfbio:string;
      departmentId:string;
  };

  
    const [serverError,setServerError] = useState<string | null>(null)
  
  

  
      
   

     const {reset:resetStaff,register:registerStaff,handleSubmit:handleSubmitStaff,setValue:setValueStaff,formState:{errors:errorsStaff}} = useForm<StaffFormData>({
      mode:"onChange",defaultValues:{
      name:"",
      email:"",
      phone_number:"",
      birthdate:"",
      university:"",
      unidepartment:"",
      graduatedate:"",
      address:"",
      city:"",
      country:"",
      jobId:"",
      county:"",
      postcode:"",
      githublink:"",
      linkedinlink:"",
      abilities:[],
      selfbio:"",
      departmentId:"",
      }
     });

   

     
  useEffect(() => {
      const fetchOtherData = async () => {
      const [universitiesData, citiesData, departmentsData, jobsData] =
        await Promise.all([
          getUniversities(),
          getCities(),
          getDepartments(),
          getJobs(1, 50),
        ]);

      setUniversities(universitiesData);
      setCities(citiesData);
      setDepartments(departmentsData);
      setJobs(jobsData);

      getDepartments1(1,10)
                .then((data) => setDepartments1(data.data as Department[]))
                .catch((error) => console.error(error));
  }
  
  const fetchData = async () => {
    try {
      if (id !== undefined) {
         
        try {
       
                const staff = await getStaff(id.toString());

                if (staff) {
                setUser(staff)
                setStage("normal");
                setFound(true);

                
                  if (staff?.city) {
                    const countiesData = await getCounties(Number(staff.city));
                    setCounties(countiesData);
                  }
                  if(staff.staffPrompts!=undefined){
                    const prompt = staff.staffPrompts.at(-1)
                    if(prompt!=undefined){
                        setAIResponseForStaff(prompt.responseText)
                    }
                }
                  
                
                resetStaff({
                  staffId:staff.id,
                  name: staff.name,
                  email: staff.email,
                  phone_number: staff.phone_number ?? "",
                  birthdate: staff.birthdate
                    ? staff.birthdate.split("T")[0]
                    : "",
                  university: staff.university ?? "",
                  unidepartment: staff.unidepartment ?? "",
                  graduatedate: staff.graduatedate
                    ? staff.graduatedate.split("T")[0]
                    : "",
                  address: staff.address ?? "",
                  city: staff.city ?? "",
                  country: staff.country ?? "",
                  jobId: staff.jobId ?? "",
                  county: staff.county ?? "",
                  postcode: staff.postcode ?? "",
                  githublink: staff.githublink ?? "",
                  linkedinlink: staff.linkedinlink ?? "",
                  abilities: staff.abilities ? staff.abilities.split(",") : [],
                  selfbio: staff.selfbio ?? "",
                  departmentId: staff.departmentId ?? "",
                });
              

                if(staff.jobId){
                    const abilitydata = await getJobInfos(staff.jobId)
                    setAbilities(abilitydata[0].split(","))
                  }

                  if(staff.abilities){
                    setActiveAbilities(staff.abilities.split(","))
                  }
              }
                
            }
        catch(error){
          console.log(error)
        }finally {
          
        }
        
      }
    
    } catch (error) {
      console.error(error);
    }
  
  };
  const load = async () => {
    await fetchOtherData()
    await fetchData();
  }
  
  load();

 
  
}, []);
    
     


      useEffect(() => { 

       if(cityPlate){
          getCounties(cityPlate)
                  .then((data) => setCounties(data))
                  .catch((error) => console.error(error))
       }
     }, [cityPlate]);


    useEffect(() => { 
      
        if(job!=""){
        getJobInfos(job)
        .then((data) => setAbilities(data[0].split(",")))
        .catch((error) => console.error(error));
        }
       
     }, [job]);
  

    
  

    const onStaffSubmit = (data:StaffFormData) => {
      addStaffMutation.mutate(data)
    };

   
    

     const addStaffMutation = useMutation({
      mutationFn: async (data:StaffFormData) => {


        data.birthdate = data.birthdate ? new Date(`${data.birthdate}T00:00:00.000Z`).toISOString(): ""
        data.graduatedate = data.graduatedate ? new Date(`${data.graduatedate}T00:00:00.000Z`).toISOString(): ""
        data.departmentId = "6a405c705b7bde7b9931b1af"

        const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/staff/staff-update`,data)

        return response.data
      },
      onSuccess:(data)=>{
          setServerError(null);
          setStage("success")
          resetStaff()

      },
      onError: (error:AxiosError) => {
          const errorMsg = (error.response?.data as {message?:string})?.message || "Personel formu gönderilemedi"
          console.log(errorMsg)
          setServerError(errorMsg);
          setStage("fail")
      }
      
    })



  return (
   <div>
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-10 col-xl-8">
                 <h2 className="h3 mb-4 page-title"> Personel Bilgilerini Güncelleme</h2>       
            
                {(stage == "normal") ? (
                  <div className='row'>
                  <div className="col-md-12 mb-4">
                  <h6 className="card-title">Personel için AI Analizi</h6>
                          
                            <textarea value={aiResponseForStaff!="" ? aiResponseForStaff : ("Bu personel için ai değerlendirmesi yok.")} rows={4}
                             className="form-control" disabled>
                            </textarea>
                </div>
                <div className="col-md-12 py-2">
                  <form onSubmit={handleSubmitStaff(onStaffSubmit)}>
                    
                  
                    <div className="form-row">
                      <div className="form-group col-md-6">
                        <label htmlFor="simpleinput">Ad ve Soyad</label>
                          <input type="text" id="simpleinput" className="form-control"
                          {...registerStaff("name",{required: "İsim ve soyisim gereklidir.."})}
                          
                          />
                          {errorsStaff.name && (
                          <p className='text-red-500 text-sm'>{String(errorsStaff.name.message)}</p>
                            )}
                      </div>
                      <div className="form-group col-md-6">
                        <label htmlFor="example-email">Email</label>
                          <input type="email" id="example-email"  className="form-control" placeholder="Email" 
                          {...registerStaff("email",{required: "Email gereklidir.",pattern : {
                              value:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                              message:"Geçersiz email"
                          }})}
                          />
                          {errorsStaff.email && (
                          <p className='text-red-500 text-sm'>{String(errorsStaff.email.message)}</p>
                          )}
                      </div>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group col-md-6">
                      <label htmlFor="example-palaceholder">Telefon numarası :</label>
                          <input className="form-control input-phoneus" id="custom-phone" placeholder="(987) 654-3210" 
                          {...registerStaff("phone_number",{required: "Telefon nu gereklidir."})}
                          />
                          {errorsStaff.phone_number && (
                          <p className='text-red-500 text-sm'>{String(errorsStaff.phone_number.message)}</p>
                            )
                            }
                      </div>

                      <div className="form-group col-md-6">
                        <label htmlFor="example-palaceholder">Doğum tarihi</label>
                          <input className="form-control" id="example-date" type="date" 
                          {...registerStaff("birthdate",{required: "Doğum tarihi gereklidir."})}
                          />
                          {errorsStaff.birthdate && (
                          <p className='text-red-500 text-sm'>{String(errorsStaff.birthdate.message)}</p>
                      )
                      }
                      </div>
                      
                    </div>
                    <div className="form-row">
                      <div className="form-group col-md-6">
                        <label htmlFor="simpleinput">Pozisyon bilgisi : </label>
                            <select className="form-control" id="validationSelect2" 
                              {...registerStaff("jobId",{required: "Pozisyon bilgisi gereklidir.",onChange: (e)=>{

                                
                                  setJob(e.target.value)
                                  
                                  
                              }})}
                              >
                              <option value=""></option>
                              <optgroup label="">
                                {jobs?.data.map((j,index)=>(
                                <option key={`${j.id}`} value={`${j.id}`}>{j.jobtitle}</option>
                            ))}
                              </optgroup>
                                
                              </select>
                              <div className="invalid-feedback"> 
                                {errorsStaff.jobId && (
                          <p className='text-red-500 text-sm'>{String(errorsStaff.jobId.message)}</p>
                          
                      )
                      }
                      </div>
                      </div>
                      <div className="form-group col-md-6">
                        <label htmlFor="simpleinput">Ülke :</label>
                          <input type="text" id="simpleinput" className="form-control"
                          {...registerStaff("country",{required: "Ülke gereklidir.."})}
                          
                          />
                          {errorsStaff.country && (
                          <p className='text-red-500 text-sm'>{String(errorsStaff.country.message)}</p>
                            )}
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="address-wpalaceholder">Adres</label>
                            <input type="text" id="address-wpalaceholder" className="form-control" placeholder="Adresinizi girin :"
                            {...registerStaff("address",{required: "Adres gereklidir."})}
                            />
                            <div className="valid-feedback"> Looks good! </div>
                            <div className="invalid-feedback"> 
                              {errorsStaff.address && (
                          <p className='text-red-500 text-sm'>{String(errorsStaff.address.message)}</p>
                                )
                                }
                    </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group col-md-6">
                        <label htmlFor="simpleinput">Departman : </label>
                              <select className="form-control" id="simple-select2"
                          {...registerStaff("departmentId",{required: "Departman bilgisi gereklidir."})}
                          >
                            <optgroup label="">
                              {departments1.map((dep,index)=>(
                                <option key={index} value={`${dep.id}`}>{dep.name}</option>
                              ))}  
                              
                
                            </optgroup>
                          
                          </select>
                              <div className="invalid-feedback"> 
                                {errorsStaff.departmentId && (
                          <p className='text-red-500 text-sm'>{String(errorsStaff.departmentId.message)}</p>
                          
                      )
                      }
                      </div>
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group col-md-4">
                        <label htmlFor="validationSelect2">Yaşadığı Şehir</label>
                              <select className="form-control" id="validationSelect2" 
                              {...registerStaff("city",{required: "Şehir gereklidir.",onChange: (e)=>{

                                
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
                                {errorsStaff.city && (
                          <p className='text-red-500 text-sm'>{String(errorsStaff.city.message)}</p>
                      )
                      }
                      </div>
                      </div>
                      
                      <div className="form-group col-md-4">
                          <label htmlFor="validationCustom33">Yaşadığı İlçe</label>
                              <select className="form-control" id="validationSelect2" 
                              {...registerStaff("county",{required: "İlçe gereklidir."})}
                              >
                              <option value="">İlçe Seç</option>
                              <optgroup label="">
                                {counties.map((county,index)=>(
                                <option  key={`${county.ilce_adi}`} value={`${county.ilce_adi}`}>{county.ilce_adi}</option>
                            ))}
                              </optgroup>
                                
                              </select>
                              <div className="invalid-feedback"> 
                                {errorsStaff.county && (
                          <p className='text-red-500 text-sm'>{String(errorsStaff.county.message)}</p>
                      ) 
                      }
                      </div>
                      
                      
                    </div>

                    <div className='form-group col-md-4'>
                      <label htmlFor="custom-zip">Posta kodu</label>
                              <input className="form-control input-zip" id="custom-zip" autoComplete="false" maxLength={9} 
                              {...registerStaff("postcode",{required: "Posta kodu gereklidir."})}
                              />
                              <div className="invalid-feedback"> 
                              {errorsStaff.postcode && (
                          <p className='text-red-500 text-sm'>{String(errorsStaff.postcode.message)}</p>
                      )
                      }
                    </div>
                    </div>

                    </div>
                    
                    

                    <div className="row mb-4">
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                            <label htmlFor="simpleinput">Github vb. Portfolyo Linki </label>
                            <input type="text" id="simpleinput" className="form-control"
                            {...registerStaff("githublink")}
                            />
                            {errorsStaff.githublink && (
                          <p className='text-red-500 text-sm'>{String(errorsStaff.githublink.message)}</p>
                      )
                      }
                        </div>
                      </div>
                      
                      <div className="col-md-6">
                          <div className="form-group mb-3">
                            <label htmlFor="simpleinput">Linkedin Linki </label>
                            <input type="text" id="simpleinput" className="form-control" 
                            {...registerStaff("linkedinlink")}
                            />
                            {errorsStaff.linkedinlink && (
                          <p className='text-red-500 text-sm'>{String(errorsStaff.linkedinlink.message)}</p>
                      )
                      }
                        </div>
                      </div>

                      <div className="col-md-12">
                        <label htmlFor="multi-select2">Yetenekler (Önce pozisyon bilgisi seçin ,sonra yetenekleri seçin) : </label>
                              <div className="d-flex flex-wrap">
                                {abilities.map((ability, index) => (
                                  <label
                                    key={ability}
                                    htmlFor={`ability-${index}`}
                                    className="border rounded px-4 py-3 mr-2 mb-2 d-flex align-items-center"
                                    style={{ cursor: "pointer" }}
                                  >
                                    <input
                                      checked={activeAbilities.includes(ability)}
                                      id={`ability-${index}`}
                                      type="checkbox"
                                      className="form-check-input position-static mr-2"
                                      value={ability}
                                      {...registerStaff("abilities", {
                                        required: "En az bir yetenek seçmelisiniz.",
                                      })}
                                    />

                                    <span>{ability}</span>
                                  </label>
                                ))}
                              </div>
                            {errorsStaff.abilities && (
                          <p className='text-red-500 text-sm'>{String(errorsStaff.abilities.message)}</p>
                      )
                      }
                      </div>

                    </div>


                    <div className="row mb-4">

                      <div className="col-md-12">
                        <div className="form-group mb-3">
                        
                            <label htmlFor="simple-select2">Mezun olunan üniversite </label>
                            <select className="form-control" id="simple-select2"
                            {...registerStaff("university")}
                            >
                              <optgroup label="">
                                {universities.map((uni,index)=>(
                                <option key={`${uni.isim,index}`} value={`${uni.isim}`}>{uni.isim}</option>
                            ))}
                              </optgroup>
                            </select>
                            {errorsStaff.university && (
                          <p className='text-red-500 text-sm'>{String(errorsStaff.university.message)}</p>
                            )}
                      </div>
                        <div className="form-group mb-3">
                            <label htmlFor="simple-select">Bölümünüz </label>
                            <select className="form-control" id="simple-select"
                            {...registerStaff("unidepartment")}
                            >
                              <optgroup label="">
                                {departments.map((dep,index)=>(
                                <option key={`${dep}`} value={`${dep}`}>{dep}</option>
                            ))}
                              </optgroup>
                            </select>
                            {errorsStaff.unidepartment && (
                          <p className='text-red-500 text-sm'>{String(errorsStaff.unidepartment.message)}</p>
                      )
                      }
                      </div>
                        <div className="form-group mb-3">
                          <label htmlFor="example-disable">Mezuniyet tarihi</label>
                          <input className="form-control" id="example-date" type="date"
                          {...registerStaff("graduatedate")}
                          />
                          {errorsStaff.graduatedate && (
                          <p className='text-red-500 text-sm'>{String(errorsStaff.graduatedate.message)}</p>
                            )
                            }
                        </div>
                      
                      </div>
                    </div>


                    <div className='row mb-4'>
                      <div className='col-md-12'>
                      <label htmlFor="validationTextarea1">Biyografisi : </label>
                            <textarea className="form-control" id="validationTextarea1" placeholder="Take a note here" required rows={3}
                            {...registerStaff("selfbio")}
                            disabled></textarea>
                            <div className="invalid-feedback">
                              {errorsStaff.selfbio && (
                          <p className='text-red-500 text-sm'>{String(errorsStaff.selfbio.message)}</p>
                              )
                              }  
                            </div>

                        </div>
                    </div>
                    

                  
                    
                    <button type="submit" className="btn btn-primary">Personel Ekle</button>
                  </form>
                  </div>
                  </div>
                ) : 
                  ( (stage == "success") ? (
                    <div>
                      <p className="text-green-500 text-lg">Güncelleme işlemi başarılı !
                        </p>
                    </div>

                  ) : (
                      (stage == "fail") ? (
                        <div>
                          <p className="text-red-500 text-lg">Güncelleme işlemi başarısız !<br></br>
                          {serverError}</p>
                        </div>
                      ) : (
                          <div></div>
                      )
                    
                  ) )
                }
                
              </div> 
            </div> 
          </div> 
        
        </div>

     
         
  )
}

export default Page
