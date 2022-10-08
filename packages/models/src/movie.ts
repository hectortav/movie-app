import { Prisma } from "@prisma/client"
import { v4 } from "uuid"
import {
    Movie,
    MovieInput,
    MovieUpdateInput,
    HydratedMovie,
    MovieSortProps,
} from "../types"
import { prisma } from "../lib"

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

interface RawSqlProps {
    movieId?: string
    creatorId?: string
    limit?: number
}

const getHydratedMovies = async ({
    movieId,
    creatorId,
    limit,
}: RawSqlProps = {}): Promise<HydratedMovie[]> => {
    return prisma.$queryRaw<HydratedMovie[]>`
        SELECT m.* , 
            SUM(CASE WHEN v."vote" = 'LIKES' THEN 1 ELSE 0 END) AS likes,
            SUM(CASE WHEN v."vote" = 'HATES' THEN 1 ELSE 0 END) AS hates
        FROM "Movie" m
        LEFT JOIN "UserVote" v 
        ON v."movieId" = m.id
        ${
            movieId !== undefined
                ? Prisma.sql`WHERE m.id = ${movieId}`
                : creatorId !== undefined
                ? Prisma.sql`WHERE m.id = ${creatorId}`
                : Prisma.empty
        }
        GROUP BY m.id
        ${limit !== undefined ? Prisma.sql`LIMIT ${limit}` : Prisma.empty}
    `
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

export const getAllMoviesSortedBy = async (
    props: MovieSortProps
): Promise<HydratedMovie[]> => {
    return []
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
): Promise<boolean> => {
    return false
}
