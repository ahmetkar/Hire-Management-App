import Suspense from "@/app/components/Suspense"
import JobManagement from "./jobmanagement"




const Page = () => {
  return (
  <Suspense>
    <JobManagement></JobManagement>
  </Suspense>
  )
}


export default Page