import { Request } from "express"
import { Session } from "express-session"

export type RequestWSession = Request & {
    session: Session & {
        userId?: string
    }
}
