import {Queue} from "bullmq"
import redis from "../configs/redis"


export const aiPromptQueue = new Queue("send-prompt",{connection:redis})
