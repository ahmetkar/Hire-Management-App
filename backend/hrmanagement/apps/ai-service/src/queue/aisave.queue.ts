import {Queue} from "bullmq"
import redis from "../configs/redis"


export const aiSaveQueue = new Queue("save-prompt",{connection:redis})
