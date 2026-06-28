
import express, { Router } from "express"
import { getUser, getUsers, loginUser, logoutUser, refreshToken, userDelete, userRegister, userUpdate } from "../controllers/auth.controller";



const router:Router = express.Router()



router.post("/user-registiration",userRegister)
router.post("/user-login",loginUser)
router.post("/user-logout",logoutUser)
router.post("/user-delete/:id",userDelete)
router.post("/user-update",userUpdate)

router.get("/get-user",getUser)
router.get("/get-users",getUsers)
router.post("/refresh-token",refreshToken)



export default router;