import React from 'react'

const page = () => {
  return (
   <div>
          <div className="row justify-content-center">

            <div className="col-12">
              <h2 className="page-title">Departman Ekleme</h2>
              <p className="text-muted">İhtiyaca göre açıklama gelecek.</p>
              <div className="card shadow mb-4">
                <div className="card-header">
                  <strong className="card-title">Form controls</strong>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label htmlFor="simpleinput">Text</label>
                        <input type="text" id="simpleinput" className="form-control" />
                      </div>
                      <div className="form-group mb-3">
                        <label htmlFor="example-email">Email</label>
                        <input type="email" id="example-email" name="example-email" className="form-control" placeholder="Email" />
                      </div>
                      <div className="form-group mb-3">
                        <label htmlFor="example-password">Password</label>
                        <input type="password" id="example-password" className="form-control" value="password" />
                      </div>
                      <div className="form-group mb-3">
                        <label htmlFor="example-palaceholder">Placeholder</label>
                        <input type="text" id="example-palaceholder" className="form-control" placeholder="placeholder" />
                      </div>
                    </div> 
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label htmlFor="example-helping">Helping text</label>
                        <input type="text" id="simpleinput" className="form-control" />
                      </div>
                      <div className="form-group mb-3">
                        <label htmlFor="example-readonly">Readonly</label>
                        <input type="text" id="simpleinput" className="form-control" />
                      </div>
                      <div className="form-group mb-3">
                        <label htmlFor="example-disable">Disabled</label>
                        <input type="text" id="simpleinput" className="form-control" />
                      </div>
                      <div className="form-group mb-3">
                        <label htmlFor="example-static">Static control</label>
                        <input type="text" id="simpleinput" className="form-control" />
                      </div>
                    </div>
                  </div>
                </div>
              </div> 
            
            </div> 

          </div> 

          
               <div className="row mb-4">
                <div className="col-md-12">
                    
                        <button className="col-md-12 btn btn-primary" type="submit">Ekle</button>
                </div>
               </div>


        </div>
  )
}

export default page
