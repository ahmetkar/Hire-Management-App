
import express, { Router } from "express"
import {getLoggedInUser, loginUser, logoutUser, refreshToken } from "../controllers/auth.controller";



const router:Router = express.Router()


router.post("/user-login",loginUser)
router.post("/user-logout",logoutUser)
router.post("/refresh-token",refreshToken)
router.get("/get-logged-user",getLoggedInUser)



export default router;