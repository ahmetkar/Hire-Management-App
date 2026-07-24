"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { JobsResponse,getJobs, getJobsByDate } from "../lists/jobs";
import Pagination from "../(panel)/application/utils/pagination";

export default function Home() {

      const [tabNu,setTabNu] = useState<number>(0)
      const latestLimit = 10
      const weekLimit = 10
      const yearLimit = 10

      const [latestJobs, setLatestJobs] = useState<JobsResponse>({
          data: [],
          total: 0,
          page: 1,
          limit: latestLimit,
          totalPages: 0,
       });


       const [thisWeekJobs, setThisWeekJobs] = useState<JobsResponse>({
          data: [],
          total: 0,
          page: 1,
          limit: weekLimit,
          totalPages: 0,
       });


       
       const [thisYearJobs, setThisYearJobs] = useState<JobsResponse>({
          data: [],
          total: 0,
          page: 1,
          limit: yearLimit,
          totalPages: 0,
       });


       const params =  useSearchParams()
       const router = useRouter()
    
       const lpage = Number(params.get("lpage")) || 1
       const latestlimit = Number(params.get("limit") || latestLimit)

        const wpage = Number(params.get("wpage")) || 1
       const weeklimit = Number(params.get("limit") || weekLimit)
     
        const ypage = Number(params.get("ypage")) || 1
       const yearlimit = Number(params.get("limit") || yearLimit)

       useEffect(() => {
    
          getJobsByDate(lpage,latestlimit,"latest")
            .then((data) => setLatestJobs(data))
            .catch((error) => console.error(error));  

          getJobsByDate(wpage,weeklimit,"thisweek")
            .then((data) => setThisWeekJobs(data))
            .catch((error) => console.error(error));  

          getJobsByDate(ypage,yearlimit,"thisyear")
            .then((data) => setThisYearJobs(data))
            .catch((error) => console.error(error));  

         
        }, [lpage,wpage,ypage,latestlimit,weeklimit,yearlimit]);


        

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
                    (latestJobs.data.map((j)=>(
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
              <Pagination pname="lpage" currentPage={latestJobs.page} totalPages={latestJobs.totalPages} ></Pagination>
              </div>
                ):  (tabNu==1) ?  (
                  <div>
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
                    (thisWeekJobs.data.map((j)=>(
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
                <Pagination pname="wpage" currentPage={thisWeekJobs.page} totalPages={thisWeekJobs.totalPages} ></Pagination>
            </div>

                ) : (tabNu==2) ? (
                  <div>
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
                    (thisYearJobs.data.map((j)=>(
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
                <Pagination pname="ypage" currentPage={thisYearJobs.page} totalPages={thisYearJobs.totalPages} ></Pagination>
              </div>
                ) :("")
              }
            

            </div>
          </div> 
    </div> 
  );
}
