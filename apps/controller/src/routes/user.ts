import { Router, Response } from "express"
import { createUser, verifyUserWithEmailPassword } from "model"
import { authorized } from "../middleware"
import { formatErrors } from "../lib"
import type { RequestWSession } from "../types"

const router = Router()

router.post("/register", async (req: RequestWSession, res: Response) => {
    const { firstname, lastname, email, password } = req.body
    const user = await createUser({
        firstname,
        lastname,
        email,
        password,
    })
    if (user.errors.length > 0) {
        res.status(403).json({ errors: formatErrors(user.errors) })
        return
    }
    if (!user.data) {
        res.status(500).json({
            errors: { field: "userId", message: "unknown error" },
        })
        return
    }
    req.session.userId = user.data.id
    res.status(200).json()
    return
})

router.post("/login", async (req: RequestWSession, res: Response) => {
    const { email, password } = req.body
    const userId = await verifyUserWithEmailPassword(email, password)
    if (userId.errors.length > 0) {
        res.status(403).send({ errors: formatErrors(userId.errors) })
        return
    }
    if (!userId.data) {
        res.status(500).json({
            errors: { field: "userId", message: "unknown error" },
        })
        return
    }
    req.session.userId = userId.data
    res.status(200).json()
    return
})

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
    res.status(500).send({ field: "userId", message: "unknown error" })
})

export default router
