import ioRedis from "ioredis"
const redis = new ioRedis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: 6379,
})

export default redis
