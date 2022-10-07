import prisma from "../lib"

export default async () => {
    console.log("Running global 🌎 teardown")
    await prisma.$transaction([
        prisma.userVote.deleteMany(),
        prisma.movie.deleteMany(),
        prisma.user.deleteMany(),
    ])

    await prisma.$disconnect()
    console.log("Cleanup completed 🧹")
}
