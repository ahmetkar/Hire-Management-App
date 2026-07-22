import {Queue} from "bullmq"
import redis from "../configs/redis"


export const managementManagerQueue = new Queue("send-notification-manager",{connection:redis})
