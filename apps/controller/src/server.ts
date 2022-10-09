import express, { Response, ErrorRequestHandler } from "express"
import session from "express-session"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import { userRoute, movieRoute } from "./routes"

const app = express()

app.use(helmet())
app.disable("x-powered-by")
app.use(cors())
app.use(morgan(process.env.NODE_ENV === "production" ? "tiny" : "dev"))
app.use(express.json())

app.use(
    session({
        name: "sid",
        store: undefined,
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

app.use("/user", userRoute)
app.use("/movie", movieRoute)

app.use((_, res: Response) => res.status(404).json({ message: "nothing here" }))

app.use((err: ErrorRequestHandler, _: any, res: Response) => {
    console.error(err)
    res.status(500).json({ message: "something went  wrong" })
})

export default app
