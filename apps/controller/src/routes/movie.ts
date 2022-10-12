import { Router, Request, Response } from "express"
import * as v from "validation-n-types"
import { MovieSortProps } from "validation-n-types"
import { authorized, validateQuery, validateBody } from "../middleware"
import { createMovie, createUserVote, getAllMoviesSortedBy } from "model"
import type { RequestWSession } from "../types"
const router = Router()

router.get(
    "/",
    validateQuery(v.movieSortPropsValidator),
    async (req: RequestWSession, res: Response) => {
        const { param, order, userId } = req.query
        const movies = await getAllMoviesSortedBy(
            {
                param,
                order,
                userId,
            } as MovieSortProps,
            req?.session?.userId as string
        )
        if (movies.errors.length > 0) {
            res.status(422).json({ ...movies })
            return
        }
        res.status(200).json({ ...movies })
    }
)

router.post(
    "/",
    authorized,
    validateBody(v.movieInputValidator),
    async (req: RequestWSession, res: Response) => {
        const { title, description } = req.body
        const movie = await createMovie({
            title,
            description,
            creatorId: req.session.userId as string,
        })
        if (movie.errors.length > 0) {
            res.status(422).json({ ...movie })
            return
        }
        res.status(200).json({ ...movie })
    }
)

router.post(
    "/:movieId",
    authorized,
    validateBody(v.userVoteInputValidator),
    async (req: RequestWSession, res: Response) => {
        const { vote } = req.body
        const { movieId } = req.params
        const userVote = await createUserVote({
            movieId,
            userId: req.session.userId as string,
            vote,
        })
        if (userVote.errors.length > 0) {
            res.status(422).json({ ...userVote })
            return
        }
        res.status(200).json({ ...userVote })
    }
)

export default router
