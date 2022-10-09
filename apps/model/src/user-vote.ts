import { UserVote, UserVoteInput } from "../types"
import { prisma } from "../lib"

export const createUserVote = async (
    userVote: UserVoteInput
): Promise<UserVote | null> => {
    try {
        const current = await prisma.userVote.findUnique({
            where: {
                voteIdentifier: {
                    movieId: userVote.movieId,
                    userId: userVote.userId,
                },
            },
        })

        if (current && current.vote === userVote.vote) {
            await deleteUserVote(userVote.userId, userVote.movieId)
            return null
        }
        if (current === null) {
            const movieCreator = await prisma.movie.findUnique({
                where: { id: userVote.movieId },
                select: { creatorId: true },
            })
            if (
                movieCreator === null ||
                userVote.userId === movieCreator.creatorId
            ) {
                return null
            }
        }

        return await prisma.userVote.upsert({
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
    } catch (e: any) {
        /* istanbul ignore next */
        throw e
    }
}

export const deleteUserVote = async (
    userId: UserVote["userId"],
    movieId: UserVote["movieId"]
): Promise<void> => {
    try {
        await prisma.userVote.delete({
            where: {
                voteIdentifier: {
                    movieId: movieId,
                    userId: userId,
                },
            },
        })
    } catch (e: any) {
        /* istanbul ignore next */
        throw e
    }
}
