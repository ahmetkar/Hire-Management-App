import express, { Router } from "express"
import {createNotification, CreateOrUpdateSettings, getSettings } from "../controllers/management.controller"

const router:Router = express.Router()

router.post("/create-setting",CreateOrUpdateSettings)

router.get("/get-settings",getSettings)

router.get("/create-notification",createNotification)


export default router;