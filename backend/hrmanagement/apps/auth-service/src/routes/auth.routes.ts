
import express, { Router } from "express"
import { loginUser, userRegister } from "../controllers/auth.controller";


const router:Router = express.Router()



router.post("/user-registiration",userRegister)
router.post("/user-login",loginUser)


export default router;