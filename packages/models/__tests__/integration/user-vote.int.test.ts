import {
    createUser,
    createMovie,
    deleteUser,
    deleteMovie,
    createUserVote,
} from "../../src"
import { shouldThrowWithCode } from "../utils"
import { prisma } from "../../lib"

const TEST_ID = "user-vote"

const user = {
    id: `${TEST_ID}_user_0000`,
    firstname: "Jane",
    lastname: "Doe",
    email: `janedoe${TEST_ID}@gmail.com`,
    password: "thisismypassword",
}

const user1 = {
    id: `${TEST_ID}_user_0001`,
    firstname: "John",
    lastname: "Doe",
    email: `johndoe${TEST_ID}@gmail.com`,
    password: "thisismypassword",
}

const user2 = {
    id: `${TEST_ID}_user_0002`,
    firstname: "John",
    lastname: "Doe 2",
    email: `johndoesecond${TEST_ID}@gmail.com`,
    password: "thisismypassword",
}

const movie = {
    id: `${TEST_ID}_movie_0000`,
    title: `A movie title ${TEST_ID}`,
    description: "A movie description",
    creatorId: user.id,
}

const movie1 = {
    id: `${TEST_ID}_movie_0001`,
    title: `A movie title 1 ${TEST_ID}`,
    description: "A movie description 1",
    creatorId: user.id,
}

beforeAll(async () => {
    try {
        await Promise.all([
            createUser(user),
            createUser(user1),
            createUser(user2),
        ])
        await Promise.all([createMovie(movie), createMovie(movie1)])
        return
    } catch (e) {
        throw new Error("Could not create users && movies")
    }
})

test("create user vote (like)", async () => {
    const dbUserVote = await createUserVote({
        movieId: movie.id,
        userId: user1.id,
        vote: "LIKES",
    })
    expect(dbUserVote).not.toEqual(null)
})

test("create user vote (hate)", async () => {
    const dbUserVote = await createUserVote({
        movieId: movie1.id,
        userId: user1.id,
        vote: "HATES",
    })
    expect(dbUserVote).not.toEqual(null)
})

test("create user vote for movie I own", async () => {
    const dbUserVote = await createUserVote({
        movieId: movie.id,
        userId: user.id,
        vote: "LIKES",
    })
    expect(dbUserVote).toEqual(null)
})

test("create user vote for movie that does not exist", async () => {
    const dbUserVote = await createUserVote({
        movieId: "random movie",
        userId: user.id,
        vote: "LIKES",
    })
    expect(dbUserVote).toEqual(null)
})

test("create user vote with user that does not exist", async () => {
    await shouldThrowWithCode(createUserVote, "P2003", {
        movieId: movie.id,
        userId: "random user id",
        vote: "LIKES",
    })
})

test("update user vote (like->hate)", async () => {
    const dbUserVote = await createUserVote({
        movieId: movie.id,
        userId: user1.id,
        vote: "HATES",
    })
    expect(dbUserVote?.vote).toEqual("HATES")
})

test("update user vote (hate->hate)", async () => {
    await expect(
        createUserVote({
            movieId: movie.id,
            userId: user1.id,
            vote: "HATES",
        })
    ).resolves.not.toThrowError()
})

test("update user vote (hate->like)", async () => {
    const dbUserVote = await createUserVote({
        movieId: movie.id,
        userId: user1.id,
        vote: "LIKES",
    })
    expect(dbUserVote?.vote).toEqual("LIKES")
})

test("update user vote (like->like)", async () => {
    await expect(
        createUserVote({
            movieId: movie.id,
            userId: user1.id,
            vote: "LIKES",
        })
    ).resolves.not.toThrowError()
})

test("delete movie", async () => {
    await expect(deleteMovie(user.id, movie.id)).resolves.not.toThrowError()
    const uv = await prisma.userVote.findMany({
        where: { movieId: movie.id },
    })
    expect(uv.length).toEqual(0)
})

test("delete user with vote", async () => {
    await createUserVote({
        movieId: movie1.id,
        userId: user2.id,
        vote: "HATES",
    })
    await expect(deleteUser(user2.id)).resolves.not.toThrowError()
    const uv = await prisma.userVote.findMany({
        where: { userId: user2.id },
    })
    expect(uv.length).toEqual(0)
})

test("delete user with movie with vote", async () => {})
