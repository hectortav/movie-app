import { Router, Request, Response } from "express"
import { Session } from "express-session"
import { createUser, verifyUserWithEmailPassword } from "model"
import { authorized } from "../middleware"
const router = Router()

type RequestWSession = Request & {
    session: Session & {
        userId?: string
    }
}

router.post("/register", async (req: RequestWSession, res: Response) => {
    const { firstname, lastname, email, password } = req.body
    try {
        const user = await createUser({
            firstname,
            lastname,
            email,
            password,
        })
        if (!user) {
            res.status(403).send({ message: "Wrong input" })
            return
        }
        req.session.userId = user.id
        res.status(200).send()
        return
    } catch (e: any) {
        if (e?.code === "P2002") {
            res.status(403).send({ message: "Email in use" })
            return
        }
    }
})
router.post("/login", async (req: RequestWSession, res: Response) => {
    const { email, password } = req.body
    try {
        const userId = await verifyUserWithEmailPassword(email, password)
        if (userId !== null) {
            req.session.userId = userId
            console.log(req.session.userId, userId)
            res.status(200).send()
            return
        }
        res.status(403).send({})
        return
    } catch (e) {
        res.status(500).send({ message: "Something went wrong" })
    }
})
router.post(
    "/logout",
    authorized,
    async (req: RequestWSession, res: Response) => {
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
            res.status(200).send()
            return
        }
        res.status(500).send({ message: "Something went wrong" })
    }
)

export default router
