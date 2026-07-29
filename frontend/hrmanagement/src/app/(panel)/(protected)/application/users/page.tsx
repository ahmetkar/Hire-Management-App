import Suspense from "@/app/components/Suspense"
import Users from "./users"




const Page = () => {
  return (
  <Suspense>
    <Users></Users>
  </Suspense>
  )
}


export default Page