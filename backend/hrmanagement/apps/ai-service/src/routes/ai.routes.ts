import express, { Router } from "express"
import { getElasticStatus, getSaveStatus, getSendStatus, SaveAIPrompt, SaveMultipileAIPrompt, SearchForNewestStaff, SearchForOldestStaff, SendAIPrompt, SendMultipileAIPrompt } from "../controllers/ai.controller";


const router:Router = express.Router()

router.post("/send-prompt",SendAIPrompt)
router.post("/send-multipile-prompt",SendMultipileAIPrompt)
router.post("/save-prompt",SaveAIPrompt)
router.post("/save-multipile-prompt",SaveMultipileAIPrompt)
router.post("/search-for-oldest",SearchForOldestStaff)
router.post("/search-for-newest",SearchForNewestStaff)


router.get("/get-save-status/:id",getSaveStatus)

router.get("/get-send-status/:id",getSendStatus)


router.get("/get-elastic-status/:id",getElasticStatus)


export default router;