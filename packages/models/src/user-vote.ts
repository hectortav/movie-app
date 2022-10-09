import { UserVote, UserVoteInput } from "../types"

export const createUserVote = async (
    userVote: UserVoteInput
): Promise<UserVote | null> => {
    return null
}

export const deleteUserVote = async (
    userId: UserVote["userId"],
    movieId: UserVote["movieId"]
): Promise<void> => {
    throw new Error("Not implemented")
}
