import express, { Router } from "express"
import {createNotification, CreateOrUpdateSettings, getNotifications, getSettings } from "../controllers/management.controller"

const router:Router = express.Router()

router.post("/create-setting",CreateOrUpdateSettings)

router.get("/get-settings",getSettings)

router.post("/create-notification",createNotification)


router.get("/get-notifications",getNotifications)

export default router;