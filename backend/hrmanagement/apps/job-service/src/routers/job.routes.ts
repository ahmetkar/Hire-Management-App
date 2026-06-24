
import express, { Router } from "express"
import { approveJobApplication, createDepartment, createJob, createJobApplication, deleteDepartment, deleteJob, denyJobApplication, getAllDepartment, getAllJobApplication, getJobApplicationByFilter, getOneDepartment, getOneJobApplication, updateDepartment, updateJob } from "../controller/job.controller"


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


router.post("/create-department",createDepartment)
router.post("/update-department",updateDepartment)
router.post("/delete-department",deleteDepartment)
router.get("/get-all-departments",getAllDepartment)
router.get("/get-department",getOneDepartment)

export default router;