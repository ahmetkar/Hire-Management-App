"use client"

import Link from 'next/link'
import React, { useState } from 'react'
import useLogout from '../utils/logout'



const Aside = () => {
    const [firstToggle,setFirstToggle] = useState(false)
    const [secToggle,setSecToggle] = useState(false)


    const logout = useLogout()

    const handleLogout = () => {
      logout.mutate()
    }

  return (
    <aside className="sidebar-left border-right bg-white shadow" id="leftSidebar" data-simplebar>
        <a href="#" className="btn collapseSidebar toggle-btn d-lg-none text-muted ml-2 mt-3" data-toggle="toggle">
          <i className="fe fe-x"><span className="sr-only"></span></i>
        </a>
        <nav className="vertnav navbar navbar-light">
         
          <div className="w-100 mb-4 d-flex">
            <a className="navbar-brand mx-auto mt-2 flex-fill text-center" href="./index.html">
              <svg version="1.1" id="logo" className="navbar-brand-img brand-sm" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 120 120" xmlSpace="preserve">
                <g>
                  <polygon className="st0" points="78,105 15,105 24,87 87,87 	" />
                  <polygon className="st0" points="96,69 33,69 42,51 105,51 	" />
                  <polygon className="st0" points="78,33 15,33 24,15 87,15 	" />
                </g>
              </svg>
            </a>
          </div>
          <ul className="navbar-nav flex-fill w-100 mb-2">
            <li className="nav-item dropdown">
             <Link data-toggle="collapse" aria-expanded="false" className="nav-link" href="/application/">
                <i className="fe fe-home fe-16"></i>
                <span className="ml-3 item-text">Ana Sayfa</span><span className="sr-only">(current)</span></Link>
              
            </li>
          </ul>
          <p className="text-muted nav-heading mt-4 mb-1">
            <span>İşe Alım&Personel Yönetimi</span>
          </p>
          <ul className="navbar-nav flex-fill w-100 mb-2">
            <li className="nav-item dropdown">
              <Link href="#" onClick={()=>setFirstToggle(!firstToggle)} className="dropdown-toggle nav-link btn btn-link text-left w-100">
                <i className="fe fe-file-text fe-16"></i>
                <span className="ml-3 item-text">İş Başvuruları</span>
              </Link>
              <ul className={` list-unstyled pl-4 w-100 ${firstToggle ? "d-block" : "d-none"}`} id="jobapp-menu">
                <li className="nav-item">
                  <a className="nav-link pl-3" href="/application/jobmanagement"><span className="ml-1 item-text">İş Başvurularını Görüntüle</span>

                  </a>
                </li>

                 <li className="nav-item">
                  <a className="nav-link pl-3" href="/application/jobmanagement/createjob"><span className="ml-1 item-text">İş İlanı Ekle</span></a>
                </li>
                 <li className="nav-item">
                  <a className="nav-link pl-3" href="/application/jobmanagement/jobs"><span className="ml-1 item-text">İş İlanlarını gör</span></a>
                </li>
                
              </ul>
            </li>
            
           


            <li className="nav-item dropdown">
              <Link href="#" onClick={()=>setSecToggle(!secToggle)} className="dropdown-toggle nav-link">
                <i className="fe fe-users fe-16"></i>
                <span className="ml-3 item-text">Kullanıcı Yönetimi</span>
              </Link>
              <ul className={` list-unstyled pl-4 w-100 ${secToggle ? "d-block" : "d-none"}`} id="staff">
                <li className="nav-item">
                  <Link className="nav-link pl-3" href="/application/users/adduser/"><span className="ml-1 item-text">Yeni Ekle</span></Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link pl-3" href="/application/users/"><span className="ml-1 item-text">Kullanıcıları Görüntüle</span></Link>
                </li>
            
              </ul>
            </li>

          </ul>
          <p className="text-muted nav-heading mt-4 mb-1">
            <span>Depertman Yönetimi</span>
          </p>
          <ul className="navbar-nav flex-fill w-100 mb-2">
            <li className="nav-item w-100">
              <Link className="nav-link" href="/application/department/">
                <i className="fe fe-briefcase fe-16"></i>
                <span className="ml-3 item-text">Depertmanları Görüntüle</span>
              </Link>
            </li>

            <li className="nav-item w-100">
              <Link className="nav-link" href="/application/department/addepartment">
                <i className="fe fe-folder-plus fe-16"></i>
                <span className="ml-3 item-text">Depertman Ekle</span>
              </Link>
            </li>
            
          </ul>
          <p className="text-muted nav-heading mt-4 mb-1">
            <span>Hesap&Ayarlar</span>
          </p>
          <ul className="navbar-nav flex-fill w-100 mb-2">
             <li className="nav-item w-100">
              <Link className="nav-link" href="/application/settings/">
                <i className="fe fe-settings fe-16"></i>
                <span className="ml-3 item-text">Ayarlar</span>
              </Link>
            </li>

            

             <li className="nav-item w-100">
              <Link className="nav-link" href="/application/settings/myprofile">
                <i className="fe fe-sidebar fe-16"></i>
                <span className="ml-3 item-text">Profilim</span>
              </Link>
            </li>
          </ul>
          
          <div className="btn-box w-100 mt-4 mb-1">
            <button disabled={logout.isPending} onClick={()=>handleLogout()}  className="btn mb-2 btn-danger btn-lg btn-block">
              <i className="fe fe-log-out fe-12 mx-2"></i><span className="small">Çıkış Yap</span>
            </button>
          </div>
        </nav>
      </aside>
  )
}

export default Aside
