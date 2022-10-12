import { Prisma } from "@prisma/client"
import prisma from "./client"
import { HydratedMovie, MovieSortProps } from "../types"

interface GetHydratedMoviesProps {
    movieId?: string
    creatorId?: string
    limit?: number
    sort?: MovieSortProps
    viewerId?: string
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
    limit,
    sort,
    viewerId,
}: GetHydratedMoviesProps = {}): Promise<HydratedMovie[]> => {
    let viewerSelect = Prisma.sql`SUM(CASE WHEN v."vote" = 'HATES' THEN 1 ELSE 0 END)::int AS hates`
    let viewerJoin = Prisma.empty
    let viewerGroup = Prisma.sql`GROUP BY m.id, u."firstname", u."lastname"`
    if (viewerId) {
        viewerSelect = Prisma.sql`
            SUM(CASE WHEN v."vote" = 'HATES' THEN 1 ELSE 0 END)::int AS hates, 
            uv."vote" as "myVote", m."creatorId" = ${viewerId} as "isMine" 
        `
        viewerJoin = Prisma.sql`LEFT JOIN "UserVote" uv ON uv."movieId" = m.id AND uv."userId" = ${viewerId}`
        viewerGroup = Prisma.sql`GROUP BY m.id, u."firstname", u."lastname", "myVote", "isMine"`
    }
    const orderBy = generateOrderBy(sort?.param, sort?.order)
    return prisma.$queryRaw<HydratedMovie[]>`
        SELECT m.* , m."createdAt" AS "createdAt", u."firstname", u."lastname",
            SUM(CASE WHEN v."vote" = 'LIKES' THEN 1 ELSE 0 END)::int AS likes,
            ${viewerSelect}
        FROM "Movie" m
        INNER JOIN "User" u
            ON m."creatorId" = u.id 
        LEFT JOIN "UserVote" v 
            ON v."movieId" = m.id
        ${viewerJoin}
        ${
            movieId !== undefined
                ? Prisma.sql`WHERE m.id = ${movieId}`
                : sort?.userId !== undefined
                ? Prisma.sql`WHERE m."creatorId" = ${sort.userId}`
                : Prisma.empty
        }
        ${viewerGroup}
        ${orderBy !== undefined ? orderBy : Prisma.empty}
        ${limit !== undefined ? Prisma.sql`LIMIT ${limit}` : Prisma.empty}
    `
}
