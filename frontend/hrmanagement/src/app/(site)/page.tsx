"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Home() {

  const [tabNu,setTabNu] = useState<Number>(0)

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
                      <a onClick={()=>setTabNu(2)}  className="nav-link" id="contact-tab" data-toggle="tab" href="#contact" role="tab" aria-controls="contact" aria-selected="false">Bu Ay/Yıla Ait İlanlar</a>
                    </li>
                  </ul>
                </div>
                
              </div>
              
              {
                tabNu == 0 ? (
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
                <tr>
                    <td colSpan={5}>
                     <span className="small text-muted text-uppercase">Yazılım Depertmanı İçin Açık İlanlar</span>
                    </td>
                  </tr>

                  <tr>
                    <td className="text-center">
                      <div className="circle circle-sm bg-light">
                        <span className="fe fe-briefcase fe-16 text-muted"></span>
                      </div>
                      
                    </td>
                    <th scope="row">  <Link href='#'>.NET Backend Developer </Link><br />
                      <span className="badge badge-light text-muted">Folder</span>
                    </th>
                    <td className="text-muted">35.800 ₺</td>
                    <td className="text-muted">Gaziantep,Türkiye</td>
                    <td className="text-muted">Mar 17, 2026</td>
                    
                  </tr>

                   <tr>
                    <td className="text-center">
                      <div className="circle circle-sm bg-light">
                        <span className="fe fe-briefcase fe-16 text-muted"></span>
                      </div>
                      
                    </td>
                    <th scope="row">  <Link href='#'>.NET Backend Developer </Link><br />
                      <span className="badge badge-light text-muted">Folder</span>
                    </th>
                    <td className="text-muted">35.800 ₺</td>
                    <td className="text-muted">Gaziantep,Türkiye</td>
                    <td className="text-muted">Mar 17, 2026</td>
                    
                  </tr>


                   <tr>
                    <td className="text-center">
                      <div className="circle circle-sm bg-light">
                        <span className="fe fe-briefcase fe-16 text-muted"></span>
                      </div>
                      
                    </td>
                    <th scope="row">  <Link href='#'>.NET Backend Developer </Link><br />
                      <span className="badge badge-light text-muted">Folder</span>
                    </th>
                    <td className="text-muted">35.800 ₺</td>
                    <td className="text-muted">Gaziantep,Türkiye</td>
                    <td className="text-muted">Mar 17, 2026</td>
                    
                  </tr>

                   <tr>
                    <td className="text-center">
                      <div className="circle circle-sm bg-light">
                        <span className="fe fe-briefcase fe-16 text-muted"></span>
                      </div>
                      
                    </td>
                    <th scope="row">  <Link href='#'>.NET Backend Developer </Link><br />
                      <span className="badge badge-light text-muted">Folder</span>
                    </th>
                    <td className="text-muted">35.800 ₺</td>
                    <td className="text-muted">Gaziantep,Türkiye</td>
                    <td className="text-muted">Mar 17, 2026</td>
                    
                  </tr>

                   <tr>
                    <td className="text-center">
                      <div className="circle circle-sm bg-light">
                        <span className="fe fe-briefcase fe-16 text-muted"></span>
                      </div>
                      
                    </td>
                    <th scope="row">  <Link href='#'>.NET Backend Developer </Link><br />
                      <span className="badge badge-light text-muted">Folder</span>
                    </th>
                    <td className="text-muted">35.800 ₺</td>
                    <td className="text-muted">Gaziantep,Türkiye</td>
                    <td className="text-muted">Mar 17, 2026</td>
                    
                  </tr>



                 
                  <tr>
                    <td colSpan={5}>
                      <span className="small text-muted text-uppercase">IT Depertmanı İçin Açık Pozisyonlar</span>
                    </td>
                  </tr>
                 
                  <tr>
                    <td className="text-center">
                      <div className="circle circle-sm bg-light">
                        <span className="fe fe-briefcase fe-16 text-muted"></span>
                      </div>
                      
                    </td>
                    <th scope="row">  <Link href='#'>.NET Backend Developer </Link><br />
                      <span className="badge badge-light text-muted">Folder</span>
                    </th>
                    <td className="text-muted">35.800 ₺</td>
                    <td className="text-muted">Gaziantep,Türkiye</td>
                    <td className="text-muted">Mar 17, 2026</td>
                    
                  </tr>


                   <tr>
                    <td className="text-center">
                      <div className="circle circle-sm bg-light">
                        <span className="fe fe-briefcase fe-16 text-muted"></span>
                      </div>
                      
                    </td>
                    <th scope="row">  <Link href='#'>.NET Backend Developer </Link><br />
                      <span className="badge badge-light text-muted">Folder</span>
                    </th>
                    <td className="text-muted">35.800 ₺</td>
                    <td className="text-muted">Gaziantep,Türkiye</td>
                    <td className="text-muted">Mar 17, 2026</td>
                    
                  </tr>

                   <tr>
                    <td className="text-center">
                      <div className="circle circle-sm bg-light">
                        <span className="fe fe-briefcase fe-16 text-muted"></span>
                      </div>
                      
                    </td>
                    <th scope="row">  <Link href='#'>.NET Backend Developer </Link><br />
                      <span className="badge badge-light text-muted">Folder</span>
                    </th>
                    <td className="text-muted">35.800 ₺</td>
                    <td className="text-muted">Gaziantep,Türkiye</td>
                    <td className="text-muted">Mar 17, 2026</td>
                    
                  </tr>

                   <tr>
                    <td className="text-center">
                      <div className="circle circle-sm bg-light">
                        <span className="fe fe-briefcase fe-16 text-muted"></span>
                      </div>
                      
                    </td>
                    <th scope="row">  <Link href='#'>.NET Backend Developer </Link><br />
                      <span className="badge badge-light text-muted">Folder</span>
                    </th>
                    <td className="text-muted">35.800 ₺</td>
                    <td className="text-muted">Gaziantep,Türkiye</td>
                    <td className="text-muted">Mar 17, 2026</td>
                    
                  </tr>

                </tbody>
              </table>
                ):  (tabNu==1) ?  (
                 <table className="table table-borderless table-striped">
                <thead>
                  <tr>
                    <th>1</th>
                    <th className="w-50">Başlık</th>
                    <th>Maaş</th>
                    <th>Konum</th>
                    <th>Yayınlanma Tarihi</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                <tr>
                    <td colSpan={5}>
                     <span className="small text-muted text-uppercase">Yazılım Depertmanı İçin Açık İlanlar</span>
                    </td>
                  </tr>

                  <tr>
                    <td className="text-center">
                      <div className="circle circle-sm bg-light">
                        <span className="fe fe-briefcase fe-16 text-muted"></span>
                      </div>
                      
                    </td>
                    <th scope="row">  <Link href='#'>.NET Backend Developer </Link><br />
                      <span className="badge badge-light text-muted">Folder</span>
                    </th>
                    <td className="text-muted">35.800 ₺</td>
                    <td className="text-muted">Gaziantep,Türkiye</td>
                    <td className="text-muted">Mar 17, 2026</td>
                    
                  </tr>

                   <tr>
                    <td className="text-center">
                      <div className="circle circle-sm bg-light">
                        <span className="fe fe-briefcase fe-16 text-muted"></span>
                      </div>
                      
                    </td>
                    <th scope="row">  <Link href='#'>.NET Backend Developer </Link><br />
                      <span className="badge badge-light text-muted">Folder</span>
                    </th>
                    <td className="text-muted">35.800 ₺</td>
                    <td className="text-muted">Gaziantep,Türkiye</td>
                    <td className="text-muted">Mar 17, 2026</td>
                    
                  </tr>


                   <tr>
                    <td className="text-center">
                      <div className="circle circle-sm bg-light">
                        <span className="fe fe-briefcase fe-16 text-muted"></span>
                      </div>
                      
                    </td>
                    <th scope="row">  <Link href='#'>.NET Backend Developer </Link><br />
                      <span className="badge badge-light text-muted">Folder</span>
                    </th>
                    <td className="text-muted">35.800 ₺</td>
                    <td className="text-muted">Gaziantep,Türkiye</td>
                    <td className="text-muted">Mar 17, 2026</td>
                    
                  </tr>

                   <tr>
                    <td className="text-center">
                      <div className="circle circle-sm bg-light">
                        <span className="fe fe-briefcase fe-16 text-muted"></span>
                      </div>
                      
                    </td>
                    <th scope="row">  <Link href='#'>.NET Backend Developer </Link><br />
                      <span className="badge badge-light text-muted">Folder</span>
                    </th>
                    <td className="text-muted">35.800 ₺</td>
                    <td className="text-muted">Gaziantep,Türkiye</td>
                    <td className="text-muted">Mar 17, 2026</td>
                    
                  </tr>

                   <tr>
                    <td className="text-center">
                      <div className="circle circle-sm bg-light">
                        <span className="fe fe-briefcase fe-16 text-muted"></span>
                      </div>
                      
                    </td>
                    <th scope="row">  <Link href='#'>.NET Backend Developer </Link><br />
                      <span className="badge badge-light text-muted">Folder</span>
                    </th>
                    <td className="text-muted">35.800 ₺</td>
                    <td className="text-muted">Gaziantep,Türkiye</td>
                    <td className="text-muted">Mar 17, 2026</td>
                    
                  </tr>



                 
                  <tr>
                    <td colSpan={5}>
                      <span className="small text-muted text-uppercase">IT Depertmanı İçin Açık Pozisyonlar</span>
                    </td>
                  </tr>
                 
                  <tr>
                    <td className="text-center">
                      <div className="circle circle-sm bg-light">
                        <span className="fe fe-briefcase fe-16 text-muted"></span>
                      </div>
                      
                    </td>
                    <th scope="row">  <Link href='#'>.NET Backend Developer </Link><br />
                      <span className="badge badge-light text-muted">Folder</span>
                    </th>
                    <td className="text-muted">35.800 ₺</td>
                    <td className="text-muted">Gaziantep,Türkiye</td>
                    <td className="text-muted">Mar 17, 2026</td>
                    
                  </tr>


                   <tr>
                    <td className="text-center">
                      <div className="circle circle-sm bg-light">
                        <span className="fe fe-briefcase fe-16 text-muted"></span>
                      </div>
                      
                    </td>
                    <th scope="row">  <Link href='#'>.NET Backend Developer </Link><br />
                      <span className="badge badge-light text-muted">Folder</span>
                    </th>
                    <td className="text-muted">35.800 ₺</td>
                    <td className="text-muted">Gaziantep,Türkiye</td>
                    <td className="text-muted">Mar 17, 2026</td>
                    
                  </tr>

                   <tr>
                    <td className="text-center">
                      <div className="circle circle-sm bg-light">
                        <span className="fe fe-briefcase fe-16 text-muted"></span>
                      </div>
                      
                    </td>
                    <th scope="row">  <Link href='#'>.NET Backend Developer </Link><br />
                      <span className="badge badge-light text-muted">Folder</span>
                    </th>
                    <td className="text-muted">35.800 ₺</td>
                    <td className="text-muted">Gaziantep,Türkiye</td>
                    <td className="text-muted">Mar 17, 2026</td>
                    
                  </tr>

                   <tr>
                    <td className="text-center">
                      <div className="circle circle-sm bg-light">
                        <span className="fe fe-briefcase fe-16 text-muted"></span>
                      </div>
                      
                    </td>
                    <th scope="row">  <Link href='#'>.NET Backend Developer </Link><br />
                      <span className="badge badge-light text-muted">Folder</span>
                    </th>
                    <td className="text-muted">35.800 ₺</td>
                    <td className="text-muted">Gaziantep,Türkiye</td>
                    <td className="text-muted">Mar 17, 2026</td>
                    
                  </tr>

                </tbody>
              </table>
                ) : (tabNu==2) ? (
                  <table className="table table-borderless table-striped">
                <thead>
                  <tr>
                    <th>2</th>
                    <th className="w-50">Başlık</th>
                    <th>Maaş</th>
                    <th>Konum</th>
                    <th>Yayınlanma Tarihi</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                <tr>
                    <td colSpan={5}>
                     <span className="small text-muted text-uppercase">Yazılım Depertmanı İçin Açık İlanlar</span>
                    </td>
                  </tr>

                  <tr>
                    <td className="text-center">
                      <div className="circle circle-sm bg-light">
                        <span className="fe fe-briefcase fe-16 text-muted"></span>
                      </div>
                      
                    </td>
                    <th scope="row">  <Link href='#'>.NET Backend Developer </Link><br />
                      <span className="badge badge-light text-muted">Folder</span>
                    </th>
                    <td className="text-muted">35.800 ₺</td>
                    <td className="text-muted">Gaziantep,Türkiye</td>
                    <td className="text-muted">Mar 17, 2026</td>
                    
                  </tr>

                   <tr>
                    <td className="text-center">
                      <div className="circle circle-sm bg-light">
                        <span className="fe fe-briefcase fe-16 text-muted"></span>
                      </div>
                      
                    </td>
                    <th scope="row">  <Link href='#'>.NET Backend Developer </Link><br />
                      <span className="badge badge-light text-muted">Folder</span>
                    </th>
                    <td className="text-muted">35.800 ₺</td>
                    <td className="text-muted">Gaziantep,Türkiye</td>
                    <td className="text-muted">Mar 17, 2026</td>
                    
                  </tr>


                   <tr>
                    <td className="text-center">
                      <div className="circle circle-sm bg-light">
                        <span className="fe fe-briefcase fe-16 text-muted"></span>
                      </div>
                      
                    </td>
                    <th scope="row">  <Link href='#'>.NET Backend Developer </Link><br />
                      <span className="badge badge-light text-muted">Folder</span>
                    </th>
                    <td className="text-muted">35.800 ₺</td>
                    <td className="text-muted">Gaziantep,Türkiye</td>
                    <td className="text-muted">Mar 17, 2026</td>
                    
                  </tr>

                   <tr>
                    <td className="text-center">
                      <div className="circle circle-sm bg-light">
                        <span className="fe fe-briefcase fe-16 text-muted"></span>
                      </div>
                      
                    </td>
                    <th scope="row">  <Link href='#'>.NET Backend Developer </Link><br />
                      <span className="badge badge-light text-muted">Folder</span>
                    </th>
                    <td className="text-muted">35.800 ₺</td>
                    <td className="text-muted">Gaziantep,Türkiye</td>
                    <td className="text-muted">Mar 17, 2026</td>
                    
                  </tr>

                   <tr>
                    <td className="text-center">
                      <div className="circle circle-sm bg-light">
                        <span className="fe fe-briefcase fe-16 text-muted"></span>
                      </div>
                      
                    </td>
                    <th scope="row">  <Link href='#'>.NET Backend Developer </Link><br />
                      <span className="badge badge-light text-muted">Folder</span>
                    </th>
                    <td className="text-muted">35.800 ₺</td>
                    <td className="text-muted">Gaziantep,Türkiye</td>
                    <td className="text-muted">Mar 17, 2026</td>
                    
                  </tr>



                 
                  <tr>
                    <td colSpan={5}>
                      <span className="small text-muted text-uppercase">IT Depertmanı İçin Açık Pozisyonlar</span>
                    </td>
                  </tr>
                 
                  <tr>
                    <td className="text-center">
                      <div className="circle circle-sm bg-light">
                        <span className="fe fe-briefcase fe-16 text-muted"></span>
                      </div>
                      
                    </td>
                    <th scope="row">  <Link href='#'>.NET Backend Developer </Link><br />
                      <span className="badge badge-light text-muted">Folder</span>
                    </th>
                    <td className="text-muted">35.800 ₺</td>
                    <td className="text-muted">Gaziantep,Türkiye</td>
                    <td className="text-muted">Mar 17, 2026</td>
                    
                  </tr>


                   <tr>
                    <td className="text-center">
                      <div className="circle circle-sm bg-light">
                        <span className="fe fe-briefcase fe-16 text-muted"></span>
                      </div>
                      
                    </td>
                    <th scope="row">  <Link href='#'>.NET Backend Developer </Link><br />
                      <span className="badge badge-light text-muted">Folder</span>
                    </th>
                    <td className="text-muted">35.800 ₺</td>
                    <td className="text-muted">Gaziantep,Türkiye</td>
                    <td className="text-muted">Mar 17, 2026</td>
                    
                  </tr>

                   <tr>
                    <td className="text-center">
                      <div className="circle circle-sm bg-light">
                        <span className="fe fe-briefcase fe-16 text-muted"></span>
                      </div>
                      
                    </td>
                    <th scope="row">  <Link href='#'>.NET Backend Developer </Link><br />
                      <span className="badge badge-light text-muted">Folder</span>
                    </th>
                    <td className="text-muted">35.800 ₺</td>
                    <td className="text-muted">Gaziantep,Türkiye</td>
                    <td className="text-muted">Mar 17, 2026</td>
                    
                  </tr>

                   <tr>
                    <td className="text-center">
                      <div className="circle circle-sm bg-light">
                        <span className="fe fe-briefcase fe-16 text-muted"></span>
                      </div>
                      
                    </td>
                    <th scope="row">  <Link href='#'>.NET Backend Developer </Link><br />
                      <span className="badge badge-light text-muted">Folder</span>
                    </th>
                    <td className="text-muted">35.800 ₺</td>
                    <td className="text-muted">Gaziantep,Türkiye</td>
                    <td className="text-muted">Mar 17, 2026</td>
                    
                  </tr>

                </tbody>
              </table>
                ) :("")
              }
            

            </div>
          </div> 
    </div> 
  );
}
