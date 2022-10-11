import { Prisma } from "@prisma/client"
import { generateOrderBy } from "../../lib"

test("return undefined when param && order = undefined", async () => {
    expect(generateOrderBy(undefined, undefined)).toEqual(undefined)
})

test("return undefined when param || order = undefined", async () => {
    expect(generateOrderBy("likes", undefined)).toEqual(undefined)
    expect(generateOrderBy(undefined, "asc")).toEqual(undefined)
})

test("return appropriate Sql for every param order combination", async () => {
    expect(generateOrderBy("likes", "desc")).toEqual(
        Prisma.sql`ORDER BY likes DESC`
    )
    expect(generateOrderBy("likes", "asc")).toEqual(
        Prisma.sql`ORDER BY likes ASC`
    )

    expect(generateOrderBy("hates", "desc")).toEqual(
        Prisma.sql`ORDER BY hates DESC`
    )
    expect(generateOrderBy("hates", "asc")).toEqual(
        Prisma.sql`ORDER BY hates ASC`
    )

    expect(generateOrderBy("createdAt", "desc")).toEqual(
        Prisma.sql`ORDER BY \"createdAt\" DESC`
    )
    expect(generateOrderBy("createdAt", "asc")).toEqual(
        Prisma.sql`ORDER BY \"createdAt\" ASC`
    )
})
