"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { JobsResponse,getJobs } from "../lists/jobs";
import Pagination from "../(panel)/application/utils/pagination";

export default function Home() {

      const [tabNu,setTabNu] = useState<number>(0)
      const defaultLimit = 5

       const [jobsResponse, setJobResponse] = useState<JobsResponse>({
          data: [],
          total: 0,
          page: 1,
          limit: defaultLimit,
          totalPages: 0,
       });


       const params =  useSearchParams()
       const router = useRouter()
    
       const page = Number(params.get("page")) || 1
       const limit = Number(params.get("limit") || defaultLimit)
     
    
       useEffect(() => {
         
          getJobs(page,limit)
            .then((data) => setJobResponse(data))
            .catch((error) => console.error(error));  

          
         
        }, [page,limit]);


        const now = new Date();

        const latestJobs = jobsResponse.data.filter(job => {
              const diff = now.getTime() - job.createdate.getTime();
              const diffDays = diff / (1000 * 60 * 60 * 24);

                return diffDays <= 7;
        });


        const startOfWeek = new Date(now);
        const day = now.getDay(); // Pazar=0, Pazartesi=1

        const diff = day === 0 ? 6 : day - 1;

        startOfWeek.setDate(now.getDate() - diff);
        startOfWeek.setHours(0, 0, 0, 0);

      const thisWeekJobs = jobsResponse.data.filter(
        job => job.createdate >= startOfWeek
      );

      const currentYear = new Date().getFullYear();

      const thisYearJobs = jobsResponse.data.filter(
        job => job.createdate.getFullYear() === currentYear
      );

  return (
     <div>
          <div className="row justify-content-center">
            <div className="col-12 col-lg-10">
              <div className="row align-items-center my-4">
                <div className="col">
                  <h2 className="page-title">İş Başvuruları</h2>
                </div>
                
              </div>
         
              <div className="row align-items-center mb-3 border-bottom no-gutters">
                <div className="col">
                  <ul className="nav nav-tabs border-0" id="myTab" role="tablist">
                    <li className="nav-item">
                      <a onClick={()=>setTabNu(0)} className="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Son Açılan İlanlar</a>
                    </li>
                    <li className="nav-item">
                      <a onClick={()=>setTabNu(1)}  className="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">Bu Haftaki İlanlar</a>
                    </li>
                    <li className="nav-item">
                      <a onClick={()=>setTabNu(2)}  className="nav-link" id="contact-tab" data-toggle="tab" href="#contact" role="tab" aria-controls="contact" aria-selected="false">Bu Yıla Ait Tüm İlanlar</a>
                    </li>
                  </ul>
                </div>
                
              </div>
              
              {
                tabNu == 0 ? (
                  <div>
                    <table className="table table-borderless table-striped">
                <thead>
                  <tr>
                    <th></th>
                    <th className="w-50">Başlık</th>
                    <th>Maaş</th>
                    <th>Konum</th>
                    <th>Departman</th>
                    <th>Yayınlanma Tarihi</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>

                  {(latestJobs ? (
                    (latestJobs.map((j)=>(
                       <tr key={j.id}>
                    <td className="text-center">
                      <div className="circle circle-sm bg-light">
                        <span className="fe fe-briefcase fe-16 text-muted"></span>
                      </div>
                      
                    </td>
                    <th scope="row">  <Link href={`/applyjob/${j.id}`}>{j.jobtitle} </Link><br />
                      <span className="badge badge-light text-muted">-{j.position}</span>
                    </th>
                    <td className="text-muted">{j.mounthlywage}</td>
                    <td className="text-muted">{j.department.name}</td>
                    <td className="text-muted">{j.createdate.toString().split("T")[0].toString()}</td>
                    
                  </tr>
                    )))
                   
                  ) : (<div></div>))}

                  
                </tbody>
              </table>
              <Pagination pname="page" currentPage={jobsResponse.page} totalPages={jobsResponse.totalPages} ></Pagination>
              </div>
                ):  (tabNu==1) ?  (
                 <table className="table table-borderless table-striped">
                <thead>
                  <tr>
                    <th></th>
                    <th className="w-50">Başlık</th>
                    <th>Maaş</th>
                    <th>Konum</th>
                    <th>Yayınlanma Tarihi</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                
                  {(thisWeekJobs ? (
                    (thisWeekJobs.map((j)=>(
                       <tr key={j.id}>
                    <td className="text-center">
                      <div className="circle circle-sm bg-light">
                        <span className="fe fe-briefcase fe-16 text-muted"></span>
                      </div>
                      
                    </td>
                    <th scope="row">  <Link href={`/applyjob/${j.id}`}>{j.jobtitle} </Link><br />
                      <span className="badge badge-light text-muted">-{j.position}</span>
                    </th>
                    <td className="text-muted">{j.mounthlywage}</td>
                    <td className="text-muted">{j.department.name}</td>
                    <td className="text-muted">{j.createdate.toString().split("T")[0].toString()}</td>
                    
                  </tr>
                    )))
                   
                  ) : (<div></div>))}
             


                 
                </tbody>
              </table>

                ) : (tabNu==2) ? (
                  <table className="table table-borderless table-striped">
                <thead>
                  <tr>
                    <th></th>
                    <th className="w-50">Başlık</th>
                    <th>Maaş</th>
                    <th>Konum</th>
                    <th>Yayınlanma Tarihi</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
              
               {(thisYearJobs ? (
                    (thisYearJobs.map((j)=>(
                       <tr key={j.id}>
                    <td className="text-center">
                      <div className="circle circle-sm bg-light">
                        <span className="fe fe-briefcase fe-16 text-muted"></span>
                      </div>
                      
                    </td>
                    <th scope="row">  <Link href={`/applyjob/${j.id}`}>{j.jobtitle} </Link><br />
                      <span className="badge badge-light text-muted">-{j.position}</span>
                    </th>
                    <td className="text-muted">{j.mounthlywage}</td>
                    <td className="text-muted">{j.department.name}</td>
                    <td className="text-muted">{j.createdate.toString().split("T")[0].toString()}</td>
                    
                  </tr>
                    )))
                   
                  ) : (<div></div>))}

                  
                </tbody>
              </table>
                ) :("")
              }
            

            </div>
          </div> 
    </div> 
  );
}
