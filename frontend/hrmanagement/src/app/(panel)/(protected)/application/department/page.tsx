import Suspense from "@/app/components/Suspense"
import Department from "./department"




const Page = () => {
  return (
  <Suspense>
    <Department></Department>
  </Suspense>
  )
}


export default Page