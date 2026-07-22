import {Queue} from "bullmq"
import redis from "../configs/redis"


export const staffQueue = new Queue("staff-create",{connection:redis})
