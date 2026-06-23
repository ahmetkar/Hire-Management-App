
import express, { Router } from "express"
import { approveJobApplication, createJob, createJobApplication, deleteJob, denyJobApplication, getAllJobApplication, getJobApplicationByFilter, getOneJobApplication, updateJob } from "../controller/job.controller"


const router:Router = express.Router()



router.post("/job-create",createJob)
router.post("/job-update",updateJob)
router.post("/job-delete",deleteJob)
router.get("/get-all-application",getAllJobApplication)
router.get("/get-one-application",getOneJobApplication)
router.post("/create-job-application",createJobApplication)

router.get("/get-job-application-by-filter",getJobApplicationByFilter)


router.post("/deny-application",denyJobApplication)
router.post("/approve-application",approveJobApplication)



export default router;