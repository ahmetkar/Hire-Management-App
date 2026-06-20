// src/app/error.tsx

"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
   <div className="align-items-center h-100 d-flex w-50 mx-auto">
        <div className="mx-auto text-center">
          <h1 className="display-1 m-0 font-weight-bolder text-muted" style={{fontSize:"80px"}}>500</h1>
          <h1 className="mb-1 text-muted font-weight-bold">OOPS!</h1>
          <h6 className="mb-3 text-muted">Something went wrong here.</h6>
          <a href="./index.html" className="btn btn-lg btn-primary px-5">Back to Dashboard</a>
        </div>
      </div>
  );
}