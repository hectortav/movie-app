import express, { Response, ErrorRequestHandler } from "express"
import session from "express-session"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import connectRedis from "connect-redis"
import { userRoute, movieRoute } from "./routes"
import { redis } from "./lib"
import { rateLimiter } from "./middleware"

require("dotenv").config()

const app = express()

app.set("trust proxy", 1)

app.use(helmet())
app.disable("x-powered-by")
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
)
app.use(morgan(process.env.NODE_ENV === "production" ? "tiny" : "dev"))
app.use(express.json())

const Store = connectRedis(session)
const store = new Store({
    client: redis,
})

app.use(
    session({
        name: "sid",
        store,
        secret: process.env.SESSION_SECRET as string,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 24 * 365,
        },
    })
)

app.use(rateLimiter)

app.use("/user", userRoute)
app.use("/movies", movieRoute)

app.use((_, res: Response) => res.status(404).json({ message: "nothing here" }))

app.use((err: ErrorRequestHandler, _: any, res: Response) => {
    console.error(err)
    res.status(500).json({ message: "something went  wrong" })
})

export default app
