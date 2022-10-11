import { v4 } from "uuid"
import {
    Movie,
    MovieInput,
    MovieUpdateInput,
    HydratedMovie,
    MovieSortProps,
    ModelResponseType,
} from "../types"
import { prisma, getHydratedMovies } from "../lib"

export const createMovie = async (
    movie: MovieInput
): Promise<ModelResponseType<Movie>> => {
    let response: ModelResponseType<Movie> = { data: null, errors: [] }
    try {
        if (movie.id === undefined) {
            movie.id = v4()
        }
        const { id, title, description, creatorId } = movie
        const dbMovie = await prisma.movie.create({
            data: {
                id,
                title,
                description,
                creator: {
                    connect: { id: creatorId },
                },
            },
        })
        response.data = dbMovie
        if (!dbMovie) {
            response.errors.push({
                field: "movieId",
                message: "could not create movie",
            })
        }
        return response
    } catch (e: any) {
        if ((e as any).code === "P2002") {
            response.errors.push({
                field: "title",
                message: "title already in use",
            })
            return response
        }
        throw e
    }
}

export const getMovieById = async (
    id: Movie["id"]
): Promise<ModelResponseType<HydratedMovie>> => {
    let response: ModelResponseType<HydratedMovie> = { data: null, errors: [] }
    try {
        const movies: HydratedMovie[] = await getHydratedMovies({
            movieId: id,
            limit: 1,
        })
        if (!movies || movies.length <= 0) {
            response.errors.push({
                field: "movieId",
                message: "movie does not exist",
            })
        } else {
            response.data = movies[0]
        }
        return response
    } catch (e: any) {
        /* istanbul ignore next */
        throw e
    }
}

export const getAllMovies = async (): Promise<
    ModelResponseType<HydratedMovie[]>
> => {
    let response: ModelResponseType<HydratedMovie[]> = {
        data: null,
        errors: [],
    }
    try {
        const movies: HydratedMovie[] = await getHydratedMovies()
        response.data = movies
        if (!movies) {
            response.errors.push({
                field: "movieId",
                message: "could not get movies",
            })
        }
        return response
    } catch (e: any) {
        /* istanbul ignore next */
        throw e
    }
}

export const getMoviesByCreator = async (
    creatorId: Movie["creatorId"]
): Promise<ModelResponseType<HydratedMovie[]>> => {
    let response: ModelResponseType<HydratedMovie[]> = {
        data: null,
        errors: [],
    }
    try {
        const movies: HydratedMovie[] = await getHydratedMovies({ creatorId })
        response.data = movies
        if (!movies) {
            response.errors.push({
                field: "movieId",
                message: "could not get movies",
            })
        }
        return response
    } catch (e: any) {
        /* istanbul ignore next */
        throw e
    }
}

export const getAllMoviesSortedBy = async ({
    param,
    order,
}: MovieSortProps): Promise<ModelResponseType<HydratedMovie[]>> => {
    let response: ModelResponseType<HydratedMovie[]> = {
        data: null,
        errors: [],
    }
    try {
        const movies: HydratedMovie[] = await getHydratedMovies({
            sort: { param, order },
        })

        response.data = movies
        if (!movies) {
            response.errors.push({
                field: "movieId",
                message: "could not get movies",
            })
        }

        return response
    } catch (e: any) {
        /* istanbul ignore next */
        throw e
    }
}

export const updateMovie = async (
    movie: MovieUpdateInput
): Promise<ModelResponseType<Movie>> => {
    let response: ModelResponseType<Movie> = {
        data: null,
        errors: [],
    }

    try {
        const dbMovie = await prisma.movie.update({
            where: { id: movie.id },
            data: {
                ...movie,
            },
        })
        response.data = dbMovie
        if (!dbMovie) {
            response.errors.push({
                field: "movieId",
                message: "could not create movie",
            })
        }
        return response
    } catch (e: any) {
        if ((e as any).code === "P2025") {
            response.errors.push({
                field: "movieId",
                message: "movie does not exist",
            })
            return response
        }
        if ((e as any).code === "P2002") {
            response.errors.push({
                field: "title",
                message: "title already in use",
            })
            return response
        }
        throw e
    }
}

export const deleteMovie = async (
    creatorId: Movie["creatorId"],
    id: Movie["id"]
): Promise<ModelResponseType<void>> => {
    let response: ModelResponseType<void> = {
        data: undefined,
        errors: [],
    }
    try {
        const dbMovie = await prisma.$queryRaw`
            DELETE FROM "Movie" m
            WHERE m.id = ${id}
                AND m."creatorId" = ${creatorId}
        `
        if (!dbMovie) {
            response.errors.push({
                field: "movieId",
                message: "unknown error",
            })
        }
        return response
    } catch (e: any) {
        if ((e as any).code === "P2025") {
            response.errors.push({
                field: "userId",
                message: "user does not exist",
            })
            return response
        }
        throw e
    }
}
