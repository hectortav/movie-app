import { Prisma } from "@prisma/client"
import prisma from "./client"
import { HydratedMovie, MovieSortProps } from "../types"

interface GetHydratedMoviesProps {
    movieId?: string
    creatorId?: string
    limit?: number
    sort?: MovieSortProps
}

export const generateOrderBy = (
    param: "likes" | "hates" | "createdAt" | undefined,
    order: "asc" | "desc" | undefined
): Prisma.Sql | undefined => {
    // work around because order by is sanitized and cannot use interpolated variables
    if (param === undefined || order === undefined) {
        return undefined
    }
    switch (param) {
        case "likes":
            switch (order) {
                case "desc":
                    return Prisma.sql`ORDER BY likes DESC`
                case "asc":
                    return Prisma.sql`ORDER BY likes ASC`
                default:
                    /* istanbul ignore next */
                    break
            }
        case "hates":
            switch (order) {
                case "desc":
                    return Prisma.sql`ORDER BY hates DESC`
                case "asc":
                    return Prisma.sql`ORDER BY hates ASC`
                default:
                    /* istanbul ignore next */
                    break
            }
        case "createdAt":
            switch (order) {
                case "desc":
                    return Prisma.sql`ORDER BY "createdAt" DESC`
                case "asc":
                    return Prisma.sql`ORDER BY "createdAt" ASC`
                default:
                    /* istanbul ignore next */
                    break
            }
    }
    /* istanbul ignore next */
    return Prisma.empty
}

export const getHydratedMovies = async ({
    movieId,
    creatorId,
    limit,
    sort,
}: GetHydratedMoviesProps = {}): Promise<HydratedMovie[]> => {
    const orderBy = generateOrderBy(sort?.param, sort?.order)
    return prisma.$queryRaw<HydratedMovie[]>`
        SELECT m.* , m."createdAt" AS "createdAt", u."firstname", u."lastname",
            SUM(CASE WHEN v."vote" = 'LIKES' THEN 1 ELSE 0 END)::int AS likes,
            SUM(CASE WHEN v."vote" = 'HATES' THEN 1 ELSE 0 END)::int AS hates
        FROM "Movie" m
        INNER JOIN "User" u
            ON m."creatorId" = u.id
        LEFT JOIN "UserVote" v 
            ON v."movieId" = m.id
        ${
            movieId !== undefined
                ? Prisma.sql`WHERE m.id = ${movieId}`
                : creatorId !== undefined
                ? Prisma.sql`WHERE m."creatorId" = ${creatorId}`
                : Prisma.empty
        }
        GROUP BY m.id, u."firstname", u."lastname"
        ${orderBy !== undefined ? orderBy : Prisma.empty}
        ${limit !== undefined ? Prisma.sql`LIMIT ${limit}` : Prisma.empty}
    `
}
