import { Router, Response } from "express"
import { get } from "http"
import { createUser, verifyUserWithEmailPassword, getUserById } from "model"
import * as v from "validation-n-types"
import { validateBody, authorized } from "../middleware"
import type { RequestWSession } from "../types"

const router = Router()

router.post(
    "/register",
    validateBody(v.userInputValidator),
    async (req: RequestWSession, res: Response) => {
        const { firstname, lastname, email, password } = req.body
        const user = await createUser({
            firstname,
            lastname,
            email,
            password,
        })
        if (user.errors.length > 0) {
            return res.status(403).json({
                errors: user.errors,
                data: null,
            })
        }
        if (!user.data) {
            return res.status(500).json({
                errors: [{ field: "userId", message: "unknown error" }],
                data: null,
            })
        }
        req.session.userId = user.data.id
        return res.status(200).json()
    }
)

router.post(
    "/login",
    validateBody(v.userLoginValidator),
    async (req: RequestWSession, res: Response) => {
        const { email, password } = req.body
        const userId = await verifyUserWithEmailPassword(email, password)
        if (userId.errors.length > 0) {
            res.status(403).send({ errors: userId.errors, data: null })
            return
        }
        if (!userId.data) {
            res.status(500).json({
                errors: [{ field: "userId", message: "unknown error" }],
                data: null,
            })
            return
        }
        req.session.userId = userId.data
        res.status(200).json()
        return
    }
)

router.post("/logout", async (req: RequestWSession, res: Response) => {
    const success = await new Promise((resolve) =>
        req.session.destroy((e) => {
            if (e) {
                resolve(false)
                return
            }
            resolve(true)
        })
    )
    if (success) {
        res.clearCookie("sid")
        res.status(200).json()
        return
    }
    res.status(500).send({
        errors: [{ field: "userId", message: "unknown error" }],
        data: null,
    })
})

router.get("/me", authorized, async (req: RequestWSession, res: Response) => {
    const response = await getUserById(req.session.userId as string)
    res.status(200).json(response)
    return
})

export default router
