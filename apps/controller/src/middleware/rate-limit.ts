import { Request, Response, NextFunction } from "express"
import { RateLimiterRedis } from "rate-limiter-flexible"
import { redis as storeClient } from "../lib"

const rateLimiterRedis = new RateLimiterRedis({
    storeClient,
    points: 10,
    duration: 1,
})

export const rateLimiter = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (process.env.NODE_ENV === "test") {
        next()
        return
    }
    rateLimiterRedis
        .consume(req.ip)
        .then(() => {
            next()
        })
        .catch((_) => {
            res.status(429).send("Too Many Requests")
        })
}
