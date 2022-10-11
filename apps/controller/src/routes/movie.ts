import { Router, Request, Response } from "express"
import { authorized } from "../middleware"
const router = Router()

// get all movies or sort or user id
router.get("/", (req: Request, res: Response) => {
    res.send({ message: "authorized" })
})
// create movie
router.post("/", authorized, (req: Request, res: Response) => res.send({}))
// vote movie
router.post("/:movieid", authorized, (req: Request, res: Response) =>
    res.send({})
)

export default router
