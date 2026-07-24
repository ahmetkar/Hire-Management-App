import redis from "../configs/redis";


//60 dk
export async function getOrSetRedisCache<T>(key:string,cachetag:string,callback:()=>Promise<T>,expire=60*60){
    const cached = await redis.get(key)

    if(cached){
        return JSON.parse(cached)
    }

    const data = await callback()


    await Promise.all([redis.set(key,JSON.stringify(data),"EX",expire),
        redis.sadd(cachetag,key),
        redis.expire(cachetag,expire)
    ])

    return data
}


export async function invalidateCacheTagKeys(cachetag:string){
    const keys = await redis.smembers(cachetag)

    if(keys.length > 0){
        await redis.del(keys)
    }
    await redis.del(cachetag)
}