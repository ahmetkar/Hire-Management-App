"use client";
import { City, getCities } from '@/app/lists/cities';
import { County, getCounties } from '@/app/lists/counties';
import { getJobInfos, getJobs,JobsResponse } from '@/app/lists/jobs';
import { getDepartments } from '@/app/lists/unidepartments';
import { getUniversities, University } from '@/app/lists/university';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import axiosInstance from '@/app/utils/axiosInstance';
import { connectSocket, socket } from '@/app/utils/socket';
import { Department,getDepartments as getDepartments1 } from '@/app/lists/department';

const Page = () => {

  const [stage,setStage] = useState("onlyuser")
   const [universities, setUniversities] = useState<University[]>([]);
     const [cities, setCities] = useState<City[]>([]);
     const [cityPlate,setCityPlate] = useState<number>(0)
     const [counties, setCounties] = useState<County[]>([]);
     const [departments, setDepartments] = useState<string[]>([]);
     const [departments1, setDepartments1] = useState<Department[]>([]);
     const [abilities, setAbilities] = useState<string[]>([]);
     const [jobs, setJobs] = useState<JobsResponse>();
     const [job,setJob] = useState("")
     const [position,setPosition] = useState<string>("");
       const [progress,setProgress] = useState<"progress" |"completed" | "failed" | "none">("none")
  
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


      getDepartments1(1,10)
              .then((data) => setDepartments1(data.data as Department[]))
              .catch((error) => console.error(error));
  
  
    }, []);
  
  
    useEffect(() => { 
  
      if(cityPlate != 0){
        console.log(cityPlate)
        getCounties(cityPlate)
        .then((data) => setCounties(data))
        .catch((error) => console.error(error));
       }

        getJobs(1,50)
        .then((data) => setJobs(data))
        .catch((error) => console.error(error));
        
       

       if(job != ""){
        getJobInfos(job)
        .then((data) => setAbilities(data[0].split(",")))
        .catch((error) => console.error(error));
       }
       
     }, [job,cityPlate]);
  

     type UserFormData = {
      name:string;
      email:string;
      role:string;
      password:string;
      repassword:string;
      departmentId:string;
     };

     type UserAndStaffFormData = {
      name:string;
      email:string;
      password:string;
      repassword:string;
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



      type StaffFormData = {
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
  
  
    const router = useRouter()
  
      
     const {reset:resetUser,register:registerUser,handleSubmit:handleSubmitUser,getValues:getValuesUser,setValue:setValueUser,formState:{errors:errorsUser}} = useForm<UserFormData>({
      mode:"onChange"
     });

     const {reset:resetStaff,register:registerStaff,handleSubmit:handleSubmitStaff,setValue:setValueStaff,formState:{errors:errorsStaff}} = useForm<StaffFormData>({
      mode:"onChange"
     });

     const {reset:resetUserAndStaff,register:registerUserAndStaff,getValues:getValuesUserAndStaff,handleSubmit:handleSubmitUserAndStaff,setValue:setValueUserAndStaff,formState:{errors:errorsUserAndStaff}} = useForm<UserAndStaffFormData>({
      mode:"onChange"
     });

     
  
    const onUserSubmit = (data:UserFormData) => {
      addUserMutation.mutate(data)
    };

    const onStaffSubmit = (data:StaffFormData) => {
      addStaffMutation.mutate(data)
    };

    const onUserAndStaffSubmit = (data:UserAndStaffFormData) => {
      addStaffAndUserMutation.mutate(data)
    };
  

    const addUserMutation = useMutation({
      mutationFn: async (data:UserFormData) => {

        const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/auth/user-register`,data)

        return response.data
          
      },
      onSuccess:(data)=>{
          setServerError(null);
          setStage("success")
          resetUser()
      },
      onError: (error:AxiosError) => {
          const errorMsg = (error.response?.data as {message?:string})?.message || "Kullanıcı formu gönderilemedi"
          console.log(errorMsg)
          setServerError(errorMsg);
          setStage("fail")
      }
      
    })

     const addStaffAndUserMutation = useMutation({
      mutationFn: async (data:UserAndStaffFormData) => {

        data.birthdate = data.birthdate ? new Date(`${data.birthdate}T00:00:00.000Z`).toISOString(): ""
        data.graduatedate = data.graduatedate ? new Date(`${data.graduatedate}T00:00:00.000Z`).toISOString(): ""

        const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/staff/staff-create`,data)

        return response.data
      },
      onSuccess:(data)=>{
          setServerError(null);
          setStage("success")
          resetUserAndStaff()

      },
      onError: (error:AxiosError) => {
          const errorMsg = (error.response?.data as {message?:string})?.message || "Görevli personel formu gönderilemedi"
          console.log(errorMsg)
          setServerError(errorMsg);
          setStage("fail")
      }
      
    })

     const addStaffMutation = useMutation({
      mutationFn: async (data:StaffFormData) => {


        data.birthdate = data.birthdate ? new Date(`${data.birthdate}T00:00:00.000Z`).toISOString(): ""
        data.graduatedate = data.graduatedate ? new Date(`${data.graduatedate}T00:00:00.000Z`).toISOString(): ""


        const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/staff/staff-create`,data)

        return response.data
      },
      onSuccess:async (data)=>{
           if(data){
                        const jobId = data.id
                        await connectSocket(jobId,"staffQueue",()=>{
                          setStage("onlystaff")
                        })
                        
                    } 
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


      useEffect(() => {
    
        socket.on("connect", () => {
      console.log("CONNECTED", socket.id);
        });
    
        socket.on("disconnect", (reason) => {
          console.log("DISCONNECTED", reason);
        });
    
        socket.on("connect_error", (err) => {
          console.log("CONNECT ERROR", err);
        });
    
        socket.onAny((event,...args)=>{
          console.log("Socket event : ",event,args)
        })
    
        const completedHandler = (payload:{jobId:string,result:unknown}) => {
            setProgress("completed");
        };
    
        const progressHandler = (payload:{jobId:string,data:unknown}) => {
            setProgress("progress");
        };
    
        const failedHandler = (payload:{jobId:string,errorr:string}) => {
            setProgress("failed");
        };
    
        socket.on("staff-completed", completedHandler);
        socket.on("staff-progress", progressHandler);
        socket.on("staff-failed", failedHandler);

        return () => {
                socket.off("staff-completed", completedHandler);
                socket.off("staff-progress", progressHandler);
                socket.off("staff-failed", failedHandler);
            };
        
        }, []);



  return (
   <div>
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-10 col-xl-8">
              <h2 className="h3 mb-4 page-title">Personel ve Kullanıcı Ekleme</h2>
              <div className="my-4">
                <ul className="nav nav-tabs mb-4" id="myTab" role="tablist">
                  <li className="nav-item">
                    <a className={`nav-link ${stage == "onlyuser" ? "active" : ""}`} onClick={()=>setStage("onlyuser")}>Özel Kullanıcı Ekleme</a>
                  </li>
                  <li className="nav-item">
                    <a className={`nav-link ${stage == "userandstaff" ? "active" : ""}`} onClick={()=>setStage("userandstaff")}>Görevli Personel Ekleme</a>
                  </li>
                  <li className="nav-item">
                    <a className={`nav-link ${stage == "onlystaff" ? "active" : ""}`} onClick={()=>setStage("onlystaff")}>Sadece Personel Ekleme</a>
                  </li>
                </ul>

                {(stage == "onlyuser") ? (
                  <form onSubmit={handleSubmitUser(onUserSubmit)}>
                  
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <label htmlFor="firstname">İsim ve soyisim</label>
                      <input type="text" id="name" className="form-control" placeholder="Ad ve soyad" 
                      {...registerUser("name",{required: "İsim ve soyisim gereklidir.."})}
                      />
                       {errorsUser.name && (
                        <p className='text-red-500 text-sm'>{String(errorsUser.name.message)}</p>
                          )}
                    </div>
             
                  </div>
                  <div className="form-group">
                    <label htmlFor="inputEmail4">Email</label>
                    <input type="email" className="form-control" id="inputEmail4" placeholder="deneme@gmailcom" 
                    {...registerUser("email",{required: "Email gereklidir..",pattern : {
                            value:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                            message:"Geçersiz email"
                        }})}
                    />
                     {errorsUser.email && (
                        <p className='text-red-500 text-sm'>{String(errorsUser.email.message)}</p>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="inputAddress5">Rolü</label>
                   <select id="inputState5" className="form-control"
                   {...registerUser("role",{required: "Rol gereklidir.."})}
                   >
                        <option value="admin">Admin</option>
                        <option value="staff">Staff</option>
                        <option value="user">User</option>
                      </select>
                      {errorsUser.role && (
                        <p className='text-red-500 text-sm'>{String(errorsUser.role.message)}</p>
                    )}
                  </div>

                  <div className="form-group">
                        <label htmlFor="simpleinput">Departman : </label>
                            <select className="form-control" id="simple-select2"
                          {...registerUser("departmentId",{required: "Departman bilgisi gereklidir."})}
                          >
                            <optgroup label="">
                              {departments1.map((dep,index)=>(
                                <option key={index} value={`${dep.id}`}>{dep.name}</option>
                              ))}  
                              
                
                            </optgroup>
                          
                          </select>
                            
                        
                              
                              <div className="invalid-feedback"> 
                                {errorsUser.departmentId && (
                          <p className='text-red-500 text-sm'>{String(errorsUser.departmentId.message)}</p>
                          
                      )
                      }
                      </div>
                      </div>
                 
                 
                  <div className="row mb-4">
                    <div className="col-md-6">
                      
                      <div className="form-group">
                        <label htmlFor="inputPassword5">Şifre berirleyin</label>
                        <input type="password" className="form-control" id="inputPassword5" 
                        {...registerUser("password",{required: "Şifre gereklidir..",pattern : {
                            value:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._\-\/])[A-Za-z\d@$!%*?&._\-\/]{8,}$/,
                            message:"Geçersiz şifre"
                        }})}
                        />
                         {errorsUser.password && (
                        <p className='text-red-500 text-sm'>{String(errorsUser.password.message)}</p>
                    )}
                      </div>
                      <div className="form-group">
                        <label htmlFor="inputPassword6">Şifreyi onaylayın</label>
                         <input type="password" className="form-control" id="inputPassword5" 
                        {...registerUser("repassword",{required: "Şifre gereklidir..",pattern : {
                            value:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._\-\/])[A-Za-z\d@$!%*?&._\-\/]{8,}$/,
                            message:"Geçersiz şifre"
                        },validate:(value)=> value == getValuesUser("password") || "Şifreler uyuşmuyor"})}
                        />
                         {errorsUser.repassword && (
                        <p className='text-red-500 text-sm'>{String(errorsUser.repassword.message)}</p>
                         )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <p className="mb-2">Şifre gereklilikleri</p>
                      <p className="small text-muted mb-2">  </p>
                      <ul className="small text-muted pl-4 mb-0">
                        <li> Minimum 8 karakter </li>
                        <li>En az bir özel karakter</li>
                        <li>En az bir rakam</li>
                        <li>En az bir büyük harf</li>
                      </ul>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary">Kullanıcı Ekle</button>
                </form>
                ) : ( (stage == "onlystaff") ? (  
                  <div className="col-md-12">
                  <h6>{(progress =="progress") ? ("Personel ekleme işlemi sürüyor..") : ((progress === "failed") ? ("Personel ekleme başarısız") :((progress=="completed") ? ("Personel ekleme başarılı") : ("")))}</h6>
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
                                <option  key={`${county.ilce_id}`} value={`${county.ilce_adi}`}>{county.ilce_adi}</option>
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
                            ></textarea>
                            <div className="invalid-feedback">
                              {errorsStaff.selfbio && (
                          <p className='text-red-500 text-sm'>{String(errorsStaff.selfbio.message)}</p>
                              )
                              }  
                            </div>

                        </div>
                    </div>
                    

                  
                    
                    <button type="submit" className="btn btn-primary">Personel Ekle</button>
                  </form></div>
                ) : (
                (stage == "userandstaff") ? (
                  <form onSubmit={handleSubmitUserAndStaff(onUserAndStaffSubmit)}>
                   
                 
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <label htmlFor="simpleinput">Ad ve Soyad</label>
                        <input type="text" id="simpleinput" className="form-control"
                         {...registerUserAndStaff("name",{required: "İsim ve soyisim gereklidir.."})}
                         
                        />
                         {errorsUserAndStaff.name && (
                        <p className='text-red-500 text-sm'>{String(errorsUserAndStaff.name.message)}</p>
                          )}
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="example-email">Email</label>
                        <input type="email" id="example-email"  className="form-control" placeholder="Email" 
                         {...registerUserAndStaff("email",{required: "Email gereklidir.",pattern : {
                            value:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                            message:"Geçersiz email"
                        }})}
                        />
                         {errorsUserAndStaff.email && (
                        <p className='text-red-500 text-sm'>{String(errorsUserAndStaff.email.message)}</p>
                        )}
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group col-md-6">
                    <label htmlFor="example-palaceholder">Telefon numarası :</label>
                        <input className="form-control input-phoneus" id="custom-phone" placeholder="(987) 654-3210" 
                         {...registerUserAndStaff("phone_number",{required: "Telefon nu gereklidir."})}
                        />
                         {errorsUserAndStaff.phone_number && (
                        <p className='text-red-500 text-sm'>{String(errorsUserAndStaff.phone_number.message)}</p>
                          )
                          }
                    </div>

                    <div className="form-group col-md-6">
                       <label htmlFor="example-palaceholder">Doğum tarihi</label>
                        <input className="form-control" id="example-date" type="date" 
                        {...registerUserAndStaff("birthdate",{required: "Doğum tarihi gereklidir."})}
                        />
                         {errorsUserAndStaff.birthdate && (
                        <p className='text-red-500 text-sm'>{String(errorsUserAndStaff.birthdate.message)}</p>
                    )
                    }
                    </div>
                    
                  </div>
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <label htmlFor="simpleinput">Pozisyon bilgisi : </label>
                           <select className="form-control" id="validationSelect2" 
                            {...registerUserAndStaff("jobId",{required: "Pozisyon bilgisi gereklidir.",onChange: (e)=>{

                              
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
                               {errorsUserAndStaff.jobId && (
                        <p className='text-red-500 text-sm'>{String(errorsUserAndStaff.jobId.message)}</p>
                        
                    )
                    }
                    </div>
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="simpleinput">Ülke :</label>
                        <input type="text" id="simpleinput" className="form-control"
                         {...registerUserAndStaff("country",{required: "Ülke gereklidir.."})}
                         
                        />
                         {errorsUserAndStaff.country && (
                        <p className='text-red-500 text-sm'>{String(errorsUserAndStaff.country.message)}</p>
                          )}
                    </div>
                  </div>
                  <div className="form-group">
                     <label htmlFor="address-wpalaceholder">Adres</label>
                          <input type="text" id="address-wpalaceholder" className="form-control" placeholder="Adresinizi girin :"
                          {...registerUserAndStaff("address",{required: "Adres gereklidir."})}
                          />
                          <div className="valid-feedback"> Looks good! </div>
                          <div className="invalid-feedback"> 
                             {errorsUserAndStaff.address && (
                        <p className='text-red-500 text-sm'>{String(errorsUserAndStaff.address.message)}</p>
                              )
                              }
                  </div>
                  </div>

                  <div className="form-row">
                     <div className="form-group col-md-6">
                      <label htmlFor="simpleinput">Departman : </label>
                            <select className="form-control" id="simple-select2"
                          {...registerUserAndStaff("departmentId",{required: "Departman bilgisi gereklidir."})}
                          >
                            <optgroup label="">
                              {departments1.map((dep,index)=>(
                                <option key={index} value={`${dep.id}`}>{dep.name}</option>
                              ))}  
                              
                
                            </optgroup>
                          
                          </select>
                            <div className="invalid-feedback"> 
                               {errorsUserAndStaff.departmentId && (
                        <p className='text-red-500 text-sm'>{String(errorsUserAndStaff.departmentId.message)}</p>
                        
                    )
                    }
                    </div>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group col-md-4">
                      <label htmlFor="validationSelect2">Yaşadığı Şehir</label>
                            <select className="form-control" id="validationSelect2" 
                            {...registerUserAndStaff("city",{required: "Şehir gereklidir.",onChange: (e)=>{

                              
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
                               {errorsUserAndStaff.city && (
                        <p className='text-red-500 text-sm'>{String(errorsUserAndStaff.city.message)}</p>
                    )
                    }
                    </div>
                    </div>
                    
                    <div className="form-group col-md-4">
                        <label htmlFor="validationCustom33">Yaşadığı İlçe</label>
                             <select className="form-control" id="validationSelect2" 
                            {...registerUserAndStaff("county",{required: "İlçe gereklidir."})}
                            >
                            <option value="">İlçe Seç</option>
                             <optgroup label="">
                              {counties.map((county,index)=>(
                              <option  key={`${county.ilce_id}`} value={`${county.ilce_adi}`}>{county.ilce_adi}</option>
                           ))}
                            </optgroup>
                              
                            </select>
                            <div className="invalid-feedback"> 
                               {errorsUserAndStaff.county && (
                        <p className='text-red-500 text-sm'>{String(errorsUserAndStaff.county.message)}</p>
                    )
                    }
                    </div>
                    
                    
                  </div>

                  <div className='form-group col-md-4'>
                    <label htmlFor="custom-zip">Posta kodu</label>
                            <input className="form-control input-zip" id="custom-zip" autoComplete="false" maxLength={9} 
                            {...registerUserAndStaff("postcode",{required: "Posta kodu gereklidir."})}
                            />
                            <div className="invalid-feedback"> 
                             {errorsUserAndStaff.postcode && (
                        <p className='text-red-500 text-sm'>{String(errorsUserAndStaff.postcode.message)}</p>
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
                          {...registerUserAndStaff("githublink")}
                          />
                           {errorsUserAndStaff.githublink && (
                        <p className='text-red-500 text-sm'>{String(errorsUserAndStaff.githublink.message)}</p>
                    )
                    }
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label htmlFor="simpleinput">Linkedin Linki </label>
                          <input type="text" id="simpleinput" className="form-control" 
                          {...registerUserAndStaff("linkedinlink")}
                          />
                           {errorsUserAndStaff.linkedinlink && (
                        <p className='text-red-500 text-sm'>{String(errorsUserAndStaff.linkedinlink.message)}</p>
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
                                    id={`ability-${index}`}
                                    type="checkbox"
                                    className="form-check-input position-static mr-2"
                                    value={ability}
                                    {...registerUserAndStaff("abilities", {
                                      required: "En az bir yetenek seçmelisiniz.",
                                    })}
                                  />

                                  <span>{ability}</span>
                                </label>
                              ))}
                            </div>
                           {errorsUserAndStaff.abilities && (
                        <p className='text-red-500 text-sm'>{String(errorsUserAndStaff.abilities.message)}</p>
                    )
                    }
                    </div>

                  </div>


                  <div className="row mb-4">

                     <div className="col-md-12">
                      <div className="form-group mb-3">
                      
                          <label htmlFor="simple-select2">Mezun olunan üniversite </label>
                          <select className="form-control" id="simple-select2"
                          {...registerUserAndStaff("university")}
                          >
                            <optgroup label="">
                              {universities.map((uni,index)=>(
                              <option key={`${uni.isim,index}`} value={`${uni.isim}`}>{uni.isim}</option>
                           ))}
                            </optgroup>
                          </select>
                           {errorsUserAndStaff.university && (
                        <p className='text-red-500 text-sm'>{String(errorsUserAndStaff.university.message)}</p>
                          )}
                     </div>
                      <div className="form-group mb-3">
                          <label htmlFor="simple-select">Bölümünüz </label>
                          <select className="form-control" id="simple-select"
                          {...registerUserAndStaff("unidepartment")}
                          >
                             <optgroup label="">
                              {departments.map((dep,index)=>(
                              <option key={`${dep}`} value={`${dep}`}>{dep}</option>
                           ))}
                            </optgroup>
                          </select>
                           {errorsUserAndStaff.unidepartment && (
                        <p className='text-red-500 text-sm'>{String(errorsUserAndStaff.unidepartment.message)}</p>
                    )
                    }
                     </div>
                      <div className="form-group mb-3">
                        <label htmlFor="example-disable">Mezuniyet tarihi</label>
                        <input className="form-control" id="example-date" type="date"
                        {...registerUserAndStaff("graduatedate")}
                        />
                         {errorsUserAndStaff.graduatedate && (
                        <p className='text-red-500 text-sm'>{String(errorsUserAndStaff.graduatedate.message)}</p>
                          )
                          }
                      </div>
                     
                    </div>
                  </div>


                  <div className='row mb-4'>
                    <div className='col-md-12'>
                     <label htmlFor="validationTextarea1">Biyografisi : </label>
                          <textarea className="form-control" id="validationTextarea1" placeholder="Take a note here" required rows={3}
                          {...registerUserAndStaff("selfbio")}
                          ></textarea>
                          <div className="invalid-feedback">
                             {errorsUserAndStaff.selfbio && (
                        <p className='text-red-500 text-sm'>{String(errorsUserAndStaff.selfbio.message)}</p>
                            )
                            }  
                          </div>

                      </div>
                  </div>

                   <div className="row mb-4">
                    <div className="col-md-6">
                      
                      <div className="form-group">
                        <label htmlFor="inputPassword5">Şifre berirleyin</label>
                        <input type="password" className="form-control" id="inputPassword5" 
                        {...registerUserAndStaff("password",{required: "Şifre gereklidir..",pattern : {
                            value:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._\-\/])[A-Za-z\d@$!%*?&._\-\/]{8,}$/,
                            message:"Geçersiz şifre"
                        }})}
                        />
                         {errorsUserAndStaff.password && (
                        <p className='text-red-500 text-sm'>{String(errorsUserAndStaff.password.message)}</p>
                    )}
                      </div>
                      <div className="form-group">
                        <label htmlFor="inputPassword6">Şifreyi onaylayın</label>
                         <input type="password" className="form-control" id="inputPassword5" 
                        {...registerUserAndStaff("repassword",{required: "Şifre gereklidir..",pattern : {
                            value:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._\-\/])[A-Za-z\d@$!%*?&._\-\/]{8,}$/,
                            message:"Geçersiz şifre"
                        },validate:(value)=> value == getValuesUserAndStaff("password") || "Şifreler uyuşmuyor"})}
                        />
                         {errorsUserAndStaff.repassword && (
                        <p className='text-red-500 text-sm'>{String(errorsUserAndStaff.repassword.message)}</p>
                         )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <p className="mb-2">Şifre gereklilikleri</p>
                      <p className="small text-muted mb-2">  </p>
                      <ul className="small text-muted pl-4 mb-0">
                        <li> Minimum 8 karakter </li>
                        <li>En az bir özel karakter</li>
                        <li>En az bir rakam</li>
                        <li>En az bir büyük harf</li>
                      </ul>
                    </div>
                  </div>
                  
                  <button type="submit" className="btn btn-primary">Görevli Personel Ekle</button>
                </form>
                  ) : ( (stage == "success") ? (
                    <div>
                      <p className="text-green-500 text-lg">Ekleme işlemi başarılı !
                        </p>
                    </div>

                  ) : (
                      (stage == "fail") ? (
                        <div>
                          <p className="text-red-500 text-lg">Ekleme işlemi başarısız !<br></br>
                          {serverError}</p>
                        </div>
                      ) : (
                          <div></div>
                      )
                    
                  )  )
                ))}
                


              </div> 
            </div> 
          </div> 
        </div>

      </div> 
         
  )
}

export default Page
