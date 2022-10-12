import {
    User,
    Movie,
    UserVote,
    PrismaClientKnownRequestError,
} from "@prisma/client"

export { PrismaClientKnownRequestError as ClientKnownRequestError } from "@prisma/client"
export type { User, Movie, UserVote }

export { ModelResponseType, MovieSortProps } from "validation-n-types"

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
    firstname: string
    lastname: string
}
export type MovieUpdateInput = Partial<MovieIdInput> & { id: Movie["id"] }

/* Movie types end */

/* UserVote types start */
export type UserVoteInput = Omit<UserVote, "id" | "createdAt" | "updatedAt">
/* UserVote types end */
