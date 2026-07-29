import { Suspense } from "react";
import Site from "./site";



export default function Home() {

  return (
    <Suspense>
      <Site></Site>
    </Suspense>
  )

}