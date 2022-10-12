import { Request, Response, NextFunction } from "express"
import * as v from "validation-n-types"

export const validateBody =
    (schema: v.AnyZodObject) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                ...req.body,
            })
        } catch (e: any) {
            return res.status(400).json({
                data: null,
                errors: v.catchZodError(e),
            })
        }
        return next()
    }

export const validateQuery =
    (schema: v.AnyZodObject) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                ...req.query,
            })
        } catch (e: any) {
            return res.status(400).json({
                data: null,
                errors: v.catchZodError(e),
            })
        }
        return next()
    }
