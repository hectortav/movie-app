import { Request, Response, NextFunction } from "express"

export const authorized = (req: Request, res: Response, next: NextFunction) => {
    return next()
}
