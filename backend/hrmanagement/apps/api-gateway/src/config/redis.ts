import Redis from 'ioredis';
import {redisCacheConnectionGauge,redisPubConnectionGauge,redisSubConnectionGauge} from "@hrmanagement/metrics"

class RedisClient {
  private static instance: Redis;
  private static isConnected = false;
  private static dupInstance : Redis;
  private static subInstance : Redis;
  private constructor() {}

  public static getInstance(): Redis {
    if (!RedisClient.instance) {
      RedisClient.instance = new Redis({port : Number(process.env.REDIS_PORT ?? 6379),host : process.env.REDIS_HOST,password:process.env.REDIS_PASSWORD, retryStrategy: (times: number) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        maxRetriesPerRequest: null});

      RedisClient.setupEventListeners();
    }
    return RedisClient.instance;
  }

  public static getSub(): Redis {
      this.subInstance = RedisClient.getInstance().duplicate();
      return this.subInstance;
  }

  public static getDuplicate(): Redis {
      this.dupInstance = RedisClient.getInstance().duplicate();
      return this.dupInstance;
  }

  private static setupEventListeners(): void {
    RedisClient.instance.on('connect', () => {
      RedisClient.isConnected = true;
      redisCacheConnectionGauge.set(1);
      console.log('Connected to Redis');
    });

    this.dupInstance.on('connect',()=>{
      redisPubConnectionGauge.set(1);
    })

    
    this.dupInstance.on('close',()=>{
      redisPubConnectionGauge.set(0);
    })

    
    this.subInstance.on('connect',()=>{
      redisSubConnectionGauge.set(1);
    });

        
    this.subInstance.on('close',()=>{
      redisSubConnectionGauge.set(0);
    });

    RedisClient.instance.on('error', (error : any) => {
      RedisClient.isConnected = false;
      console.log('Redis connection error:', error);
    });

    RedisClient.instance.on('close', () => {
      RedisClient.isConnected = false;
      console.log('Redis connection closed');
    });

    RedisClient.instance.on('reconnecting', () => {
      console.log('Reconnecting to Redis...');
    });

    RedisClient.instance.on('ready', () => {
      console.log('Redis client is ready');
    });

    RedisClient.instance.on('end', () => {
      RedisClient.isConnected = false;
      console.log('Redis connection ended');
    });
  }


 
  public static async closeConnection() {
    if (RedisClient.instance) {
      try {
        await RedisClient.instance.quit();
        await RedisClient.dupInstance.quit();
        await RedisClient.subInstance.quit();
        console.log('Redis connection closed');
      } catch (error) {
        console.log('Error closing Redis connection:', error);
      }
    }
  }

  public static isReady(): boolean {
    return RedisClient.isConnected;
  }

  public static async testConnection(): Promise<boolean> {
    try {
      await RedisClient.instance.ping();
      return true;
    } catch (error) {
      console.log('Redis connection test failed:', error);
      return false;
    }
  }
}

export default RedisClient.getInstance();
export { RedisClient };