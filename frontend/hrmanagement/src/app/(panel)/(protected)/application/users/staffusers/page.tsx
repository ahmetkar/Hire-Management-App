import Suspense from "@/app/components/Suspense"
import StaffUsers from "./staffusers"




const Page = () => {
  return (
  <Suspense>
    <StaffUsers></StaffUsers>
  </Suspense>
  )
}


export default Page