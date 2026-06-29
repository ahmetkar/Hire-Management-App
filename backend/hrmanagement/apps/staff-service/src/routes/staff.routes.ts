
import express, { Router } from "express"
import { createStaffAndUser, getUser, getUserByFilter, getUsers, userDelete, userUpdate } from "../controllers/staff.controller";


const router:Router = express.Router()


router.post("/user-create",createStaffAndUser)
router.post("/get-user-by-filter/:usertype",getUserByFilter)
router.post("/user-delete/:id/:usertype",userDelete)
router.get("/user-update/:usertype",userUpdate)
router.get("/get-users/:usertype",getUsers)
router.get("/get-user",getUser)




export default router;