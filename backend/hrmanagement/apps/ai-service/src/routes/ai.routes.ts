import express, { Router } from "express"
import { SaveAIPrompt, SaveMultipileAIPrompt, SearchForNewestStaff, SearchForOldestStaff, SendAIPrompt, SendMultipileAIPrompt } from "../controllers/ai.controller";


const router:Router = express.Router()

router.post("/send-prompt",SendAIPrompt)
router.post("/send-multipile-prompt",SendMultipileAIPrompt)
router.post("/save-prompt",SaveAIPrompt)
router.post("/save-multipile-prompt",SaveMultipileAIPrompt)
router.post("/search-for-oldest",SearchForOldestStaff)
router.post("/search-for-newest",SearchForNewestStaff)




export default router;