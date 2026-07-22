import {Queue} from "bullmq"
import redis from "../configs/redis"


export const elasticSearchQueue = new Queue("elastic-search",{connection:redis})
