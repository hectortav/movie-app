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
