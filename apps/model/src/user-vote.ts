import * as v from "validation-n-types"
import { UserVote, UserVoteInput, ModelResponseType } from "../types"
import { prisma } from "../lib"

export const createUserVote = async (
    userVote: UserVoteInput
): Promise<ModelResponseType<UserVote>> => {
    let response: ModelResponseType<UserVote> = { data: null, errors: [] }
    try {
        v.userVoteInputModelValidator.parse(userVote)
        const current = await prisma.userVote.findUnique({
            where: {
                voteIdentifier: {
                    movieId: userVote.movieId,
                    userId: userVote.userId,
                },
            },
        })

        if (current && current.vote === userVote.vote) {
            const { errors } = await deleteUserVote(
                userVote.userId,
                userVote.movieId
            )
            response.errors = [...response.errors, ...errors]
            return response
        }
        if (current === null) {
            const movie = await prisma.movie.findUnique({
                where: { id: userVote.movieId },
                select: { creatorId: true },
            })
            if (movie === null) {
                response.errors.push({
                    field: "movieId",
                    message: "movie doe not exist",
                })
                return response
            }
            if (userVote.userId === movie.creatorId) {
                response.errors.push({
                    field: "userId",
                    message: "cannot vote your own movie",
                })
                return response
            }
        }

        const dbUserVote = await prisma.userVote.upsert({
            where: {
                voteIdentifier: {
                    movieId: userVote.movieId,
                    userId: userVote.userId,
                },
            },
            update: {
                vote: userVote.vote,
            },
            create: {
                ...userVote,
            },
        })
        response.data = dbUserVote
        if (!dbUserVote) {
            response.errors.push({
                field: "userVoteId",
                message: "could not create vote",
            })
        }
        return response
    } catch (e: any) {
        const verrors = v.catchZodError(e)
        /* prettier-ignore */
        if (verrors.length > 0) { return { data: response.data, errors: [...response.errors, ...verrors], } }

        if ((e as any).code === "P2003") {
            response.errors.push({
                field: "userId",
                message: "user does not exist",
            })
            return response
        }

        /* istanbul ignore next */
        throw e
    }
}

export const deleteUserVote = async (
    userId: UserVote["userId"],
    movieId: UserVote["movieId"]
): Promise<ModelResponseType<void>> => {
    let response: ModelResponseType<void> = { data: undefined, errors: [] }
    try {
        const dbUserVote = await prisma.userVote.delete({
            where: {
                voteIdentifier: {
                    movieId: movieId,
                    userId: userId,
                },
            },
        })
        if (!dbUserVote) {
            response.errors.push({
                field: "userVoteId",
                message: "unknown error",
            })
        }
        return response
    } catch (e: any) {
        if ((e as any).code === "P2025") {
            response.errors.push({
                field: "userVoteId",
                message: "vote does not exist",
            })
            return response
        }
        /* istanbul ignore next */
        throw e
    }
}
