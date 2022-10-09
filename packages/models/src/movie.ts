import { v4 } from "uuid"
import {
    Movie,
    MovieInput,
    MovieUpdateInput,
    HydratedMovie,
    MovieSortProps,
} from "../types"
import { prisma, getHydratedMovies } from "../lib"

export const createMovie = async (movie: MovieInput): Promise<Movie | null> => {
    try {
        if (movie.id === undefined) {
            movie.id = v4()
        }
        return await prisma.movie.create({
            data: {
                ...movie,
            },
        })
    } catch (e: any) {
        throw e
    }
}

export const getMovieById = async (
    id: Movie["id"]
): Promise<HydratedMovie | null> => {
    try {
        const movies: HydratedMovie[] = await getHydratedMovies({
            movieId: id,
            limit: 1,
        })
        return movies.length > 0 ? movies[0] : null
    } catch (e: any) {
        /* istanbul ignore next */
        throw e
    }
}

export const getAllMovies = async (): Promise<HydratedMovie[]> => {
    try {
        return await getHydratedMovies()
    } catch (e: any) {
        /* istanbul ignore next */
        throw e
    }
}

export const getMoviesByCreator = async (
    creatorId: Movie["creatorId"]
): Promise<HydratedMovie[]> => {
    try {
        return await getHydratedMovies({ creatorId })
    } catch (e: any) {
        /* istanbul ignore next */
        throw e
    }
}

export const getAllMoviesSortedBy = async ({
    param,
    order,
}: MovieSortProps): Promise<HydratedMovie[]> => {
    try {
        return await getHydratedMovies({ sort: { param, order } })
    } catch (e: any) {
        /* istanbul ignore next */
        throw e
    }
}

export const updateMovie = async (
    movie: MovieUpdateInput
): Promise<Movie | null> => {
    try {
        return await prisma.movie.update({
            where: { id: movie.id },
            data: {
                ...movie,
            },
        })
    } catch (e: any) {
        throw e
    }
}

export const deleteMovie = async (
    creatorId: Movie["creatorId"],
    id: Movie["id"]
): Promise<void> => {
    try {
        await prisma.$queryRaw`
            DELETE FROM "Movie" m
            WHERE m.id = ${id}
                AND m."creatorId" = ${creatorId}
        `
    } catch (e: any) {
        /* istanbul ignore next */
        throw e
    }
}
