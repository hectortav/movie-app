import {
    User,
    Movie,
    UserVote,
    PrismaClientKnownRequestError,
} from "@prisma/client"

export { PrismaClientKnownRequestError as ClientKnownRequestError } from "@prisma/client"
export type { User, Movie, UserVote }

export { ModelResponseType } from "types"

/* User types start */
type Optional<Type, Key extends keyof Type> = Omit<Type, Key> &
    Partial<Pick<Type, Key>>

export type UserIdInput = Omit<User, "createdAt" | "updatedAt">
export type UserInput = Optional<UserIdInput, "id">
export type UserUpdateInput = Omit<
    Partial<UserIdInput> & { id: User["id"] },
    "password" | "email"
>
/* User types end */

/* Movie types start */
export type MovieIdInput = Omit<Movie, "createdAt" | "updatedAt">
export type MovieInput = Optional<MovieIdInput, "id">

export type HydratedMovie = MovieIdInput & {
    likes: number
    hates: number
    createdAt: Date
    creatorName: string
}
export type MovieUpdateInput = Partial<MovieIdInput> & { id: Movie["id"] }

export interface MovieSortProps {
    param: "likes" | "hates" | "createdAt"
    order: "ASC" | "DESC"
}

/* Movie types end */

/* UserVote types start */
export type UserVoteInput = Omit<UserVote, "id" | "createdAt" | "updatedAt">
/* UserVote types end */
