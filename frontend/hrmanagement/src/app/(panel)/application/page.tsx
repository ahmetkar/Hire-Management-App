import React from 'react'

const page = () => {
  return (
      <div>
          <div className="row justify-content-center">
            <div className="col-12">

              <div className="row align-items-center mb-2">
                <div className="col">
                  <h2 className="h5 page-title">Welcome!</h2>
                </div>
                <div className="col-auto">
                  <form className="form-inline">
                    <div className="form-group d-none d-lg-inline">
                      <label htmlFor="reportrange" className="sr-only">Date Ranges</label>
                      <div id="reportrange" className="px-2 py-2 text-muted">
                        <span className="small"></span>
                      </div>
                    </div>
                    <div className="form-group">
                      <button type="button" className="btn btn-sm"><span className="fe fe-refresh-ccw fe-16 text-muted"></span></button>
                      <button type="button" className="btn btn-sm mr-2"><span className="fe fe-filter fe-16 text-muted"></span></button>
                    </div>
                  </form>
                </div>
              </div>

              <div className="card shadow my-4">
                <div className="card-body">
                  <div className="row align-items-center my-4">
                    <div className="col-md-4">
                      <div className="mx-4">
                        <strong className="mb-0 text-uppercase text-muted">Bu ayki istatistikler</strong><br />
                      
                      </div>
                      <div className="row align-items-center">
                        <div className="col-6">
                          <div className="p-4">
                            <p className="small text-uppercase text-muted mb-0">İş Başvuru Sayısı</p>
                            <span className="h2 mb-0">1.2K</span>
                            <p className="small mb-0">
                              <span className="fe fe-arrow-up text-success fe-12"></span>
                              <span className="text-muted ml-1">+1.5%</span>
                            </p>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="p-4">
                            <p className="small text-uppercase text-muted mb-0">İşe Alım Sayısı</p>
                            <span className="h2 mb-0">1.2K</span>
                            <p className="small mb-0">
                              <span className="fe fe-arrow-up text-success fe-12"></span>
                              <span className="text-muted ml-1">+1.5%</span>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="row align-items-center">
                        <div className="col-6">
                          <div className="p-4">
                            <p className="small text-uppercase text-muted mb-0">Mülakat Sayısı</p>
                            <span className="h2 mb-0">1.2K</span>
                            <p className="small mb-0">
                              <span className="fe fe-arrow-up text-success fe-12"></span>
                              <span className="text-muted ml-1">+1.5%</span>
                            </p>
                          </div>
                        </div>

                        <div className="col-6">
                          <div className="p-4">
                           <p className="small text-uppercase text-muted mb-0">Reddedilen Başvuru Sayısı</p>
                            <span className="h2 mb-0">1.2K</span>
                            <p className="small mb-0">
                              <span className="fe fe-arrow-up text-success fe-12"></span>
                              <span className="text-muted ml-1">+1.5%</span>
                            </p>
                          </div>
                        </div>

                      </div>
                    </div>
                    <div className="col-md-8">
                      <div className="mr-4">
                        <div id="areaChart"></div>
                      </div>
                    </div> 
                  </div> 
                </div>
              </div> 
              
              <div className="row">
                <div className="col-md-4">
                  <div className="card shadow eq-card mb-4">
                    <div className="card-body">
                      <div className="card-title">
                        <strong>Özet Rakamlar</strong>
                        <a className="float-right small text-muted" href="#!">View all</a>
                      </div>
                      <div className="row mt-b">
                        <div className="col-6 text-center mb-3 border-right">
                          <p className="text-muted mb-1">Bugünkü İş Başvuru Sayısı</p>
                          <h6 className="mb-1">830</h6>
                          <p className="text-muted mb-2">+5.5% <span className="fe fe-arrow-up fe-12 text-success"></span></p>
                        </div>
                        <div className="col-6 text-center mb-3">
                          <p className="text-muted mb-1">Bugünkü İşe Alım Sayısı</p>
                          <h6 className="mb-1">4,830</h6>
                          <p className="text-muted">-5.5%</p>
                        </div>
                        <div className="col-6 text-center border-right">
                          <p className="text-muted mb-1">Bu Haftaki İş Başvuru Sayısı</p>
                          <h6 className="mb-1">680</h6>
                          <p className="text-muted mb-2">+1.5% <span className="fe fe-arrow-up fe-12 text-warning"></span></p>
                        </div>
                        <div className="col-6 text-center">
                          <p className="text-muted mb-1">Bu Haftaki İşe Alım Sayısı</p>
                          <h6 className="mb-1">430</h6>
                          <p className="text-muted">-5.5%</p>
                        </div>
                      </div>
                      <div className="chart-widget">
                        <div id="columnChartWidget" style={{width:400,height:300}}></div>
                      </div>
                    </div> 
                  </div> 
                </div> 
                <div className="col-md-8">
                  <div className="card shadow eq-card">
                    <div className="card-header">
                      <strong className="card-title">Bildirimler</strong>
                      <a className="float-right small text-muted" href="#!">View all</a>
                    </div>
                    <div className="card-body">
                      <table className="table table-hover table-borderless table-striped mt-n3 mb-n1">
                        <thead>
                          <tr>
                          
                            <th>Açıklama</th>
                            <th>Tarih</th>
                            <th>Görülme</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                          
                            <td>Enim Limited<br /><span className="small text-muted">901-6206 Cras Av.</span></td>
                            <td>Apr 24, 2019</td>
                            <td><span className="dot dot-lg bg-danger mr-2"></span></td>
                          </tr>
                          <tr>
                           
                        
                            <td>Nunc Lectus Incorporated<br /><span className="small text-muted">Ap #705-5389 Id St.</span></td>
                            <td>May 23, 2020</td>
                            <td><span className="dot dot-lg bg-success mr-2"></span></td>
                          </tr>
                          <tr>
                         
                         
                            <td>Nisi Aenean Eget Limited<br />
                              <span className="small text-muted">7425 Malesuada Rd.</span></td>
                            <td>Nov 4, 2019</td>
                            <td><span className="dot dot-lg bg-success mr-2"></span></td>
                          </tr>
                          <tr>
                        
                         
                            <td>Pellentesque Associates<br />
                              <span className="small text-muted">896 Sodales St.</span></td>
                            <td>Mar 27, 2020</td>
                            <td><span className="dot dot-lg bg-danger mr-2"></span></td>
                          </tr>
                          <tr>
                          
                          
                            <td>Augue Incorporated<br />
                              <span className="small text-muted">4583 Id St.</span></td>
                            <td>Jan 13, 2020</td>
                            <td><span className="dot dot-lg bg-success mr-2"></span></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div> 
                </div> 

              </div>

             
            </div>
          </div> 
        </div>
  )
}

export default page
