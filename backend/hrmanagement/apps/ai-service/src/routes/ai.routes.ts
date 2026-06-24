import express, { Router } from "express"
import { SendAIPrompt } from "../controllers/ai.controller";


const router:Router = express.Router()

router.post("/send-prompt",SendAIPrompt)





export default router;