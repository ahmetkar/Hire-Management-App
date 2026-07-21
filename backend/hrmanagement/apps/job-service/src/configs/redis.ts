import Redis from 'ioredis';


class RedisClient {
  private static instance: Redis;
  private static subscriber: Redis;
  private static isConnected = false;

  private constructor() {}

  public static getInstance(): Redis {
    if (!RedisClient.instance) {
      RedisClient.instance = new Redis({port : Number(process.env.REDIS_PORT ?? 6379),host : process.env.REDIS_HOST,password:process.env.REDIS_PASSWORD, retryStrategy: (times: number) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        maxRetriesPerRequest: null});

      RedisClient.setupEventListeners();
      RedisClient.setupKeyspaceNotifications();
    }
    return RedisClient.instance;
  }

  private static setupEventListeners(): void {
    RedisClient.instance.on('connect', () => {
      RedisClient.isConnected = true;
      console.log('Connected to Redis');
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


   private static async setupKeyspaceNotifications() {
    try {
      /**
       * Redis keyspace notificationları açar.
       * KEA = çoğu key eventini aktif eder.
       */
      await RedisClient.instance.config(
        "SET",
        "notify-keyspace-events",
        "KEA"
      );

      /**
       * Pub/Sub için ayrı bağlantı gerekir.
       */
      RedisClient.subscriber = RedisClient.instance.duplicate();

      RedisClient.subscriber.on("error", (error) => {
        console.error("Redis subscriber error:", error);
      });

      await RedisClient.subscriber.psubscribe("__keyevent@0__:*");

      RedisClient.subscriber.on("pmessage", (pattern, channel, message) => {
        const eventName = channel.split(":").pop();

        console.log("Redis event:", {
          pattern,
          eventName,
          key: message,
        });

        if (eventName === "set") {
          console.log(`${message} eklendi/güncellendi`);
        }

        if (eventName === "del") {
          console.log(`${message} silindi`);
        }

        if (eventName === "expired") {
          console.log(`${message} expire oldu`);
        }

        if (eventName === "hset") {
          console.log(`${message} hash olarak güncellendi`);
        }
      });

      console.log("Redis keyspace notifications dinleniyor");
    } catch (error) {
      console.error("Redis keyspace notification setup error:", error);
    }
  }

  public static async closeConnection() {
    if (RedisClient.instance) {
      try {
        await RedisClient.instance.quit();
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