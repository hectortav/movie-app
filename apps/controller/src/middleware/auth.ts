import { Response, NextFunction } from "express"
import type { RequestWSession } from "../types"

export const authorized = (
    req: RequestWSession,
    res: Response,
    next: NextFunction
) => {
    if (!req.session.userId) {
        res.status(401).json({ field: "userId", message: "not authorized" })
        return
    }
    return next()
}
