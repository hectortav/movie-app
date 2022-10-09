import { Router, Request, Response } from "express"
import { authorized } from "../middleware"
const router = Router()

router.post("/register", (req: Request, res: Response) => res.send({}))
router.post("/login", (req: Request, res: Response) => res.send({}))
router.post("/logout", authorized, (req: Request, res: Response) =>
    res.send({})
)

export default router
