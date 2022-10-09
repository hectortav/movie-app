import { PrismaClient, Prisma } from "@prisma/client"

let config: Prisma.PrismaClientOptions = {}

require("dotenv").config()

if (process.env.NODE_ENV === "development") {
    config.log = ["query", "warn", "error"]
    console.log(`SQL log config: ${config.log}`)
}
const prisma = new PrismaClient(config)

export default prisma
