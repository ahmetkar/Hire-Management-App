import { Suspense } from "react";
import Site from "./site";



export default function Page() {

  return (
    <Suspense>
      <Site></Site>
    </Suspense>
  )

}