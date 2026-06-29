
import express, { Router } from "express"
import {loginUser, logoutUser, refreshToken } from "../controllers/auth.controller";



const router:Router = express.Router()


router.post("/user-login",loginUser)
router.post("/user-logout",logoutUser)
router.post("/refresh-token",refreshToken)



export default router;