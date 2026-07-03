
import express, { Router } from "express"
import { staffDelete, staffUpdate, createStaff, getStaff, getAllStaff, getUserAndStaff, getAllUserAndStaff, getUserAndStaffByFilter, getStaffByFilter } from "../controllers/staff.controller";


const router:Router = express.Router()


router.post("/staff-delete",staffDelete)
router.post("/staff-update",staffUpdate)
router.post("/staff-create",createStaff)
router.get("/get-staff/:id",getStaff)
router.get("/get-all-staff",getAllStaff)
router.get("/get-user-and-staff",getUserAndStaff)
router.get("/get-all-user-and-staff",getAllUserAndStaff)
router.get("/get-user-and-staff-by-filter",getUserAndStaffByFilter)
router.get("/get-staff-by-filter",getStaffByFilter)




export default router;