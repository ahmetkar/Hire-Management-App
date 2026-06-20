// src/app/not-found.tsx

import Link from "next/link";

export default function NotFound() {
  return (
  
   <div className="align-items-center h-100 d-flex w-50 mx-auto">
        <div className="mx-auto text-center">
          <h1 className="display-1 m-0 font-weight-bolder text-muted" style={{fontSize:"80px"}}>404</h1>
          <h1 className="mb-1 text-muted font-weight-bold">OOPS!</h1>
          <h6 className="mb-3 text-muted">The page could not be found.</h6>
          <Link href="/" className="btn btn-lg btn-primary px-5">Back to Dashboard</Link>
        </div>
    </div>
 
  );
}