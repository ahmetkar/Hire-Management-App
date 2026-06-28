
import express, { Router } from "express"
import { createStaff, deleteStaff, getAllStaff, getOneStaff, getStaffByFilter, updateStaff } from "../controllers/staff.controller";


const router:Router = express.Router()


router.post("/staff-create",createStaff)
router.post("/staff-update",updateStaff)
router.post("/staff-delete/:id",deleteStaff)
router.get("/get-staff/:staffid",getOneStaff)
router.get("/get-all-staff",getAllStaff)
router.get("/get-staff-by-filter",getStaffByFilter)




export default router;