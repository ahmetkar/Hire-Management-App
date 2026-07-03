
import express, { Router } from "express"
import {getAllUser, getLoggedInUser, getUser, getUserByFilter, loginUser, logoutUser, refreshToken, userDelete, userRegister, userUpdate } from "../controllers/auth.controller";



const router:Router = express.Router()


router.post("/get-user-by-filter",getUserByFilter)
router.post("/user-delete/:id",userDelete)
router.get("/user-update",userUpdate)
router.get("/get-users/",getAllUser)



router.post("/user-register",userRegister)
router.get("/get-user/:id",getUser)

router.post("/user-login",loginUser)
router.post("/user-logout",logoutUser)
router.post("/refresh-token",refreshToken)
router.get("/get-logged-user",getLoggedInUser)



export default router;