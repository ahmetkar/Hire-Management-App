import {Queue} from "bullmq"
import redis from "../configs/redis"


export const managementStaffQueue = new Queue("send-notification-staff",{connection:redis})
