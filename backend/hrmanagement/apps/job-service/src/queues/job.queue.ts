import {Queue} from "bullmq"
import redis from "../configs/redis"


export const jobAppQueue = new Queue("job-app-create",{connection:redis})
