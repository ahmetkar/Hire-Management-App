
import express, { Router } from "express"
import { approveJobApplication, createDepartment, createJob, createJobApplication, deleteDepartment, deleteJob, denyJobApplication, getAllDepartment, getAllJobApplication, getAllJobs, getJobApplicationByFilter, getJobByFilter, getOneDepartment, getOneJob, getOneJobApplication, searchAllJobApplication, updateDepartment, updateJob } from "../controller/job.controller"


const router:Router = express.Router()



router.post("/job-create",createJob)
router.post("/job-update",updateJob)
router.post("/job-delete/:id",deleteJob)



router.get("/get-one-job/:id",getOneJob)
router.get("/get-all-jobs",getAllJobs)
router.get("/get-job-by-filter",getJobByFilter)


router.get("/get-all-application",getAllJobApplication)
router.get("/search-all-application",searchAllJobApplication)
router.get("/get-one-application/:jobid",getOneJobApplication)
router.get("/get-job-application-by-filter",getJobApplicationByFilter)

router.post("/create-job-application",createJobApplication)
router.post("/deny-application",denyJobApplication)
router.post("/approve-application",approveJobApplication)


router.post("/create-department",createDepartment)
router.post("/update-department",updateDepartment)
router.post("/delete-department/:id",deleteDepartment)
router.get("/get-all-departments",getAllDepartment)
router.get("/get-department/:id",getOneDepartment)

export default router;