import React from 'react'

const Topbar = () => {
  return (
    <nav className="topnav navbar navbar-light">
        <button type="button" className="navbar-toggler text-muted mt-2 p-0 mr-3 collapseSidebar">
          <i className="fe fe-menu navbar-toggler-icon"></i>
        </button>
        <form className="form-inline mr-auto searchform text-muted">
          <input className="form-control mr-sm-2 bg-transparent border-0 pl-4 text-muted" type="search" placeholder="Type something..." aria-label="Search" />
        </form>
        <ul className="nav">
          <li className="nav-item">
            <a className="nav-link text-muted my-2" href="#" id="modeSwitcher" data-mode="light">
              <i className="fe fe-sun fe-16"></i>
            </a>
          </li>
      
          
        </ul>
      </nav>
  )
}

export default Topbar
