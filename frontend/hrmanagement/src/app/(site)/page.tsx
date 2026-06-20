import Image from "next/image";

export default function Home() {
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
                      <a className="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Son Açılan Pozisyonlar</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">Bu Haftaki Pozisyonlar</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" id="contact-tab" data-toggle="tab" href="#contact" role="tab" aria-controls="contact" aria-selected="false">Bu Ay/Yıla Ait Pozisyonlar</a>
                    </li>
                  </ul>
                </div>
                
              </div>
              
              <table className="table table-borderless table-striped">
                <thead>
                  <tr>
                    <th></th>
                    <th className="w-50">Name</th>
                    <th>Owner</th>
                    <th>Last Update</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                <tr>
                    <td colSpan={5}>
                      <span className="small text-muted text-uppercase">Yazılım Depertmanı İçin Açık Pozisyonlar</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-center">
                      <div className="circle circle-sm bg-light">
                        <span className="fe fe-folder fe-16 text-muted"></span>
                      </div>
                      <span className="dot dot-md bg-success mr-1"></span>
                    </td>
                    <th scope="row"> Admin Template Components<br />
                      <span className="badge badge-light text-muted">Folder</span>
                    </th>
                    <td className="text-muted">Penelope Roy</td>
                    <td className="text-muted">Mar 17, 2020</td>
                    <td>
                      <div className="file-action">
                        <button type="button" className="btn btn-link dropdown-toggle more-vertical p-0 text-muted mx-auto" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          <span className="text-muted sr-only">Action</span>
                        </button>
                        <div className="dropdown-menu m-2">
                          <a className="dropdown-item" href="#"><i className="fe fe-chevrons-right fe-12 mr-4"></i>Move</a>
                          <a className="dropdown-item" href="#"><i className="fe fe-copy fe-12 mr-4"></i>Copy</a>
                          <a className="dropdown-item" href="#"><i className="fe fe-edit-3 fe-12 mr-4"></i>Rename</a>
                          <a className="dropdown-item" href="#"><i className="fe fe-delete fe-12 mr-4"></i>Delete</a>
                          <a className="dropdown-item" href="#"><i className="fe fe-share fe-12 mr-4"></i>Share</a>
                          <a className="dropdown-item" href="#"><i className="fe fe-download fe-12 mr-4"></i>Download</a>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-center">
                      <div className="circle circle-sm bg-light">
                        <span className="fe fe-archive fe-16 text-muted"></span>
                      </div>
                      <span className="dot dot-md bg-warning mr-1"></span>
                    </td>
                    <th scope="row"> Template<br />
                      <span className="badge badge-light text-muted mr-2">2.2M</span>
                      <span className="badge badge-light text-muted">Zip</span>
                    </th>
                    <td className="text-muted"> Cade Beard </td>
                    <td className="text-muted">Aug 20, 2020</td>
                    <td>
                      <div className="file-action">
                        <button type="button" className="btn btn-link dropdown-toggle more-vertical p-0 text-muted mx-auto" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          <span className="text-muted sr-only">Action</span>
                        </button>
                        <div className="dropdown-menu m-2">
                          <a className="dropdown-item" href="#"><i className="fe fe-chevrons-right fe-12 mr-4"></i>Move</a>
                          <a className="dropdown-item" href="#"><i className="fe fe-copy fe-12 mr-4"></i>Copy</a>
                          <a className="dropdown-item" href="#"><i className="fe fe-edit-3 fe-12 mr-4"></i>Rename</a>
                          <a className="dropdown-item" href="#"><i className="fe fe-delete fe-12 mr-4"></i>Delete</a>
                          <a className="dropdown-item" href="#"><i className="fe fe-share fe-12 mr-4"></i>Share</a>
                          <a className="dropdown-item" href="#"><i className="fe fe-download fe-12 mr-4"></i>Download</a>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-center">
                      <div className="circle circle-sm bg-light">
                        <span className="fe fe-film fe-16 text-muted"></span>
                      </div>
                      <span className="dot dot-md bg-success mr-1"></span>
                    </td>
                    <th scope="row"> Creative Logo<br />
                      <span className="badge badge-light text-muted mr-2">1G</span>
                      <span className="badge badge-light text-muted">Mp4</span>
                    </th>
                    <td className="text-muted">Whilemina Pate</td>
                    <td className="text-muted">Oct 10, 2019</td>
                    <td>
                      <div className="file-action">
                        <button type="button" className="btn btn-link dropdown-toggle more-vertical p-0 text-muted mx-auto" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          <span className="text-muted sr-only">Action</span>
                        </button>
                        <div className="dropdown-menu m-2">
                          <a className="dropdown-item" href="#"><i className="fe fe-chevrons-right fe-12 mr-4"></i>Move</a>
                          <a className="dropdown-item" href="#"><i className="fe fe-copy fe-12 mr-4"></i>Copy</a>
                          <a className="dropdown-item" href="#"><i className="fe fe-edit-3 fe-12 mr-4"></i>Rename</a>
                          <a className="dropdown-item" href="#"><i className="fe fe-delete fe-12 mr-4"></i>Delete</a>
                          <a className="dropdown-item" href="#"><i className="fe fe-share fe-12 mr-4"></i>Share</a>
                          <a className="dropdown-item" href="#"><i className="fe fe-download fe-12 mr-4"></i>Download</a>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-center">
                      <div className="circle circle-sm bg-light">
                        <span className="fe fe-folder fe-16 text-muted"></span>
                      </div>
                      <span className="dot dot-md bg-primary mr-1"></span>
                    </td>
                    <th scope="row"> Bootstrap<br />
                      <span className="badge badge-light text-muted">Folder</span>
                    </th>
                    <td className="text-muted">Lionel Carney</td>
                    <td className="text-muted">Jan 20, 2021</td>
                    <td>
                      <div className="file-action">
                        <button type="button" className="btn btn-link dropdown-toggle more-vertical p-0 text-muted mx-auto" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          <span className="text-muted sr-only">Action</span>
                        </button>
                        <div className="dropdown-menu m-2">
                          <a className="dropdown-item" href="#"><i className="fe fe-chevrons-right fe-12 mr-4"></i>Move</a>
                          <a className="dropdown-item" href="#"><i className="fe fe-copy fe-12 mr-4"></i>Copy</a>
                          <a className="dropdown-item" href="#"><i className="fe fe-edit-3 fe-12 mr-4"></i>Rename</a>
                          <a className="dropdown-item" href="#"><i className="fe fe-delete fe-12 mr-4"></i>Delete</a>
                          <a className="dropdown-item" href="#"><i className="fe fe-share fe-12 mr-4"></i>Share</a>
                          <a className="dropdown-item" href="#"><i className="fe fe-download fe-12 mr-4"></i>Download</a>
                        </div>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td colSpan={5}>
                      <span className="small text-muted text-uppercase">IT Depertmanı İçin Açık Pozisyonlar</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-center">
                      <div className="circle circle-sm bg-light">
                        <span className="fe fe-file-text fe-16 text-muted"></span>
                      </div>
                      <span className="dot dot-md bg-secondary mr-1"></span>
                    </td>
                    <th scope="row"> Template<br />
                      <span className="badge badge-light text-muted mr-2">120K</span>
                      <span className="badge badge-light text-muted">Text</span>
                    </th>
                    <td className="text-muted">Nayda Delacruz</td>
                    <td className="text-muted">Sep 19, 2020</td>
                    <td>
                      <div className="file-action">
                        <button type="button" className="btn btn-link dropdown-toggle more-vertical p-0 text-muted mx-auto" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          <span className="text-muted sr-only">Action</span>
                        </button>
                        <div className="dropdown-menu m-2">
                          <a className="dropdown-item" href="#"><i className="fe fe-chevrons-right fe-12 mr-4"></i>Move</a>
                          <a className="dropdown-item" href="#"><i className="fe fe-copy fe-12 mr-4"></i>Copy</a>
                          <a className="dropdown-item" href="#"><i className="fe fe-edit-3 fe-12 mr-4"></i>Rename</a>
                          <a className="dropdown-item" href="#"><i className="fe fe-delete fe-12 mr-4"></i>Delete</a>
                          <a className="dropdown-item" href="#"><i className="fe fe-share fe-12 mr-4"></i>Share</a>
                          <a className="dropdown-item" href="#"><i className="fe fe-download fe-12 mr-4"></i>Download</a>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-center">
                      <div className="circle circle-sm bg-light">
                        <span className="fe fe-pen-tool fe-16 text-muted"></span>
                      </div>
                      <span className="dot dot-md bg-success mr-1"></span>
                    </td>
                    <th scope="row"> Tiny Admin Homepagge UI<br />
                      <span className="badge badge-light text-muted mr-2">5M</span>
                      <span className="badge badge-light text-muted">PSD</span>
                    </th>
                    <td className="text-muted">Leilani Larson</td>
                    <td className="text-muted">Feb 5, 2020</td>
                    <td>
                      <div className="file-action">
                        <button type="button" className="btn btn-link dropdown-toggle more-vertical p-0 text-muted mx-auto" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          <span className="text-muted sr-only">Action</span>
                        </button>
                        <div className="dropdown-menu m-2">
                          <a className="dropdown-item" href="#"><i className="fe fe-chevrons-right fe-12 mr-4"></i>Move</a>
                          <a className="dropdown-item" href="#"><i className="fe fe-copy fe-12 mr-4"></i>Copy</a>
                          <a className="dropdown-item" href="#"><i className="fe fe-edit-3 fe-12 mr-4"></i>Rename</a>
                          <a className="dropdown-item" href="#"><i className="fe fe-delete fe-12 mr-4"></i>Delete</a>
                          <a className="dropdown-item" href="#"><i className="fe fe-share fe-12 mr-4"></i>Share</a>
                          <a className="dropdown-item" href="#"><i className="fe fe-download fe-12 mr-4"></i>Download</a>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-center">
                      <div className="circle circle-sm bg-light">
                        <span className="fe fe-file fe-16 text-muted"></span>
                      </div>
                      <span className="dot dot-md bg-warning mr-1"></span>
                    </td>
                    <th scope="row"> Index page convverted<br />
                      <span className="badge badge-light text-muted mr-2">1M</span>
                      <span className="badge badge-light text-muted">HTML</span>
                    </th>
                    <td className="text-muted">Dennis Pollard</td>
                    <td className="text-muted">Oct 30, 2019</td>
                    <td>
                      <div className="file-action">
                        <button type="button" className="btn btn-link dropdown-toggle more-vertical p-0 text-muted mx-auto" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          <span className="text-muted sr-only">Action</span>
                        </button>
                        <div className="dropdown-menu m-2">
                          <a className="dropdown-item" href="#"><i className="fe fe-chevrons-right fe-12 mr-4"></i>Move</a>
                          <a className="dropdown-item" href="#"><i className="fe fe-copy fe-12 mr-4"></i>Copy</a>
                          <a className="dropdown-item" href="#"><i className="fe fe-edit-3 fe-12 mr-4"></i>Rename</a>
                          <a className="dropdown-item" href="#"><i className="fe fe-delete fe-12 mr-4"></i>Delete</a>
                          <a className="dropdown-item" href="#"><i className="fe fe-share fe-12 mr-4"></i>Share</a>
                          <a className="dropdown-item" href="#"><i className="fe fe-download fe-12 mr-4"></i>Download</a>
                        </div>
                      </div>
                    </td>
                  </tr>

                </tbody>
              </table>

            </div>
          </div> 
    </div> 
  );
}
