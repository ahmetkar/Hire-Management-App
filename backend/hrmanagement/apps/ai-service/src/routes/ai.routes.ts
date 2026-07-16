import express, { Router } from "express"
import { SendAIPrompt, SendMultipileAIPrompt, SendRAGPrompt } from "../controllers/ai.controller";


const router:Router = express.Router()

router.post("/send-prompt",SendAIPrompt)
router.post("/send-multipile-prompt",SendMultipileAIPrompt)
router.post("/send-rag-prompt",SendRAGPrompt)




export default router;