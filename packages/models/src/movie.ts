import { Prisma } from "@prisma/client"

type MovieInput = Prisma.MovieCreateInput | Omit<Prisma.MovieCreateInput, "id">

type HydratedMovie = Prisma.MovieGroupByOutputType & {
    likes: number
    hates: number
    creatorName: string
}

export const createMovie = async (
    movie: MovieInput
): Promise<Prisma.MovieGroupByOutputType | undefined> => {
    return undefined
}

export const getMovieById = async (
    id: string
): Promise<HydratedMovie | undefined> => {
    return undefined
}

export const getAllMovies = async (): Promise<HydratedMovie[]> => {
    return []
}

export const getMoviesByCreator = async (
    creatorId: string
): Promise<HydratedMovie[]> => {
    return []
}

interface SortProps {
    likes?: "asc" | "desc"
    hates?: "asc" | "desc"
    createdAt?: "asc" | "desc"
}

export const getAllMoviesSortedBy = async (
    props: SortProps
): Promise<HydratedMovie[]> => {
    return []
}

export const updateMovie = async (
    movie: Prisma.MovieUpdateInput & { id: string }
): Promise<Prisma.MovieGroupByOutputType | undefined> => {
    return undefined
}

export const deleteMovie = async (
    creatorId: string,
    id: string
): Promise<boolean> => {
    return false
}
