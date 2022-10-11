import { Router, Request, Response } from "express"
import { authorized } from "../middleware"
import { getAllMovies, createMovie, createUserVote } from "model"
import type { RequestWSession } from "../types"
const router = Router()

// get all movies or sort or user id
router.get("/", async (req: Request, res: Response) => {
    const movies = await getAllMovies()
    if (movies.errors.length > 0) {
        res.status(422).json({ movies })
        return
    }
    res.status(200).json({ movies })
})
// create movie
router.post("/", authorized, async (req: RequestWSession, res: Response) => {
    const { title, description } = req.body
    const movie = await createMovie({
        title,
        description,
        creatorId: req.session.userId as string,
    })
    if (movie.errors.length > 0) {
        res.status(422).json({ movie })
        return
    }
    res.status(200).json({ movie })
})
// vote movie
router.post(
    "/:movieId",
    authorized,
    async (req: RequestWSession, res: Response) => {
        const { vote } = req.body
        const { movieId } = req.params
        const movies = await createUserVote({
            movieId,
            userId: req.session.userId as string,
            vote,
        })
        if (movies.errors.length > 0) {
            res.status(422).json({ movies })
            return
        }
        res.status(200).json({ movies })
    }
)

export default router
