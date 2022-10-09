import { Prisma } from "@prisma/client"
import { generateOrderBy } from "../../lib"

test("return undefined when param && order = undefined", async () => {
    expect(generateOrderBy(undefined, undefined)).toEqual(undefined)
})

test("return undefined when param || order = undefined", async () => {
    expect(generateOrderBy("likes", undefined)).toEqual(undefined)
    expect(generateOrderBy(undefined, "ASC")).toEqual(undefined)
})

test("return appropriate Sql for every param order combination", async () => {
    expect(generateOrderBy("likes", "DESC")).toEqual(
        Prisma.sql`ORDER BY likes DESC`
    )
    expect(generateOrderBy("likes", "ASC")).toEqual(
        Prisma.sql`ORDER BY likes ASC`
    )

    expect(generateOrderBy("hates", "DESC")).toEqual(
        Prisma.sql`ORDER BY hates DESC`
    )
    expect(generateOrderBy("hates", "ASC")).toEqual(
        Prisma.sql`ORDER BY hates ASC`
    )

    expect(generateOrderBy("createdAt", "DESC")).toEqual(
        Prisma.sql`ORDER BY \"createdAt\" DESC`
    )
    expect(generateOrderBy("createdAt", "ASC")).toEqual(
        Prisma.sql`ORDER BY \"createdAt\" ASC`
    )
})
/*
export const getHydratedMovies = async ({
    movieId,
    creatorId,
    limit,
    sort,
}: GetHydratedMoviesProps = {}): Promise<HydratedMovie[]> => {
    const orderBy = generateOrderBy(sort?.param, sort?.order)
    return prisma.$queryRaw<HydratedMovie[]>`
        SELECT m.* , m."createdAt" AS "createdAt",
            SUM(CASE WHEN v."vote" = 'LIKES' THEN 1 ELSE 0 END) AS likes,
            SUM(CASE WHEN v."vote" = 'HATES' THEN 1 ELSE 0 END) AS hates
        FROM "Movie" m
        LEFT JOIN "UserVote" v 
        ON v."movieId" = m.id
        ${
            movieId !== undefined
                ? Prisma.sql`WHERE m.id = ${movieId}`
                : creatorId !== undefined
                ? Prisma.sql`WHERE m."creatorId" = ${creatorId}`
                : Prisma.empty
        }
        GROUP BY m.id
        ${orderBy !== undefined ? orderBy : Prisma.empty}
        ${limit !== undefined ? Prisma.sql`LIMIT ${limit}` : Prisma.empty}
    `
}
*/
