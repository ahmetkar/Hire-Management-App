import express, { Router } from "express"
import { createFirstSettings, createNotification, getSettings, sendNotification, updateSettings } from "../controllers/management.controller"

const router:Router = express.Router()

router.post("/create-setting",createFirstSettings)
router.post("/update-settings",updateSettings)
router.get("/get-settings",getSettings)

router.get("/create-notification",createNotification)
router.get("/send-notification",sendNotification)

export default router;