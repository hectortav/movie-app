import {
    createUser,
    createMovie,
    getMovieById,
    getAllMovies,
    getMoviesByCreator,
    getAllMoviesSortedBy,
    updateMovie,
    deleteMovie,
    deleteUser,
} from "../src"
import { shouldThrowWithCode } from "./utils"

import { prisma } from "../lib"

const TEST_ID = "movie"

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

const movie = {
    id: `${TEST_ID}_movie_0000`,
    title: "A movie title",
    description: "A movie description",
    creatorId: user.id,
}

const movie1 = {
    title: "A movie title 1",
    description: "A movie description 1",
    creatorId: user1.id,
}

beforeAll(async () => {
    try {
        return await Promise.all([createUser(user), createUser(user1)])
    } catch (e) {
        throw new Error("Could not create users")
    }
})

test("create movie", async () => {
    const dbMovie = await createMovie(movie)
    expect(dbMovie).not.toEqual(null)
})

test("create movie without id", async () => {
    const dbMovie = await createMovie({ ...movie1, id: undefined })
    expect(dbMovie).not.toEqual(null)
    await prisma.userVote.create({
        data: {
            id: `${TEST_ID}_0000`,
            vote: "LIKES",
            userId: user1.id,
            movieId: movie.id,
        },
    })
    await prisma.userVote.create({
        data: {
            id: `${TEST_ID}_0001`,
            vote: "HATES",
            userId: user.id,
            movieId: movie.id,
        },
    })
})

test("create movie that exists", async () => {
    await shouldThrowWithCode(createMovie, "P2002", movie)
})

test("get movie by Id", async () => {
    const dbMovie = await getMovieById(movie.id)
    expect(dbMovie?.title).toEqual(movie.title)
})

test("get all movies", async () => {
    const dbMovies = await getAllMovies()
    expect(dbMovies?.length).toBeGreaterThanOrEqual(2)
})

test("get all movies sort by Likes descending", async () => {
    const [dbMovies0, dbMovies1] = await getAllMoviesSortedBy({
        param: "likes",
        order: "DESC",
    })

    expect(dbMovies1).not.toEqual(null)
    expect(dbMovies0.likes).toBeGreaterThanOrEqual(dbMovies1.likes)
})

test("get all movies sort by Likes ascending", async () => {
    const [dbMovies0, dbMovies1] = await getAllMoviesSortedBy({
        param: "likes",
        order: "ASC",
    })

    expect(dbMovies1).not.toEqual(null)
    expect(dbMovies1.likes).toBeGreaterThanOrEqual(dbMovies0.likes)
})

test("get all movies sort by Hates descending", async () => {
    const [dbMovies0, dbMovies1] = await getAllMoviesSortedBy({
        param: "hates",
        order: "DESC",
    })
    expect(dbMovies1).not.toEqual(null)
    expect(dbMovies0.hates).toBeGreaterThanOrEqual(dbMovies1.hates)
})

test("get all movies sort by Hates ascending", async () => {
    const [dbMovies0, dbMovies1] = await getAllMoviesSortedBy({
        param: "hates",
        order: "ASC",
    })
    expect(dbMovies1).not.toEqual(null)
    expect(dbMovies1.hates).toBeGreaterThanOrEqual(dbMovies0.hates)
})

test("get all movies sort by createdAt descending", async () => {
    const [dbMovies0, dbMovies1] = await getAllMoviesSortedBy({
        param: "createdAt",
        order: "DESC",
    })
    expect(dbMovies1).not.toEqual(null)
    expect(dbMovies0.createdAt.getTime()).toBeGreaterThanOrEqual(
        dbMovies1.createdAt.getTime()
    )
})

test("get all movies sort by createdAt ascending", async () => {
    const [dbMovies0, dbMovies1] = await getAllMoviesSortedBy({
        param: "createdAt",
        order: "ASC",
    })
    expect(dbMovies1).not.toEqual(null)
    expect(dbMovies1.createdAt.getTime()).toBeGreaterThanOrEqual(
        dbMovies0.createdAt.getTime()
    )
})

test("get movies by creator with one item", async () => {
    const dbMovies = await getMoviesByCreator(user.id)
    expect(dbMovies?.length).toEqual(1)
})

test("update movie", async () => {
    const dbMovie = await updateMovie({
        id: movie.id,
        title: "A new title for this movie!",
    })
    expect(dbMovie?.title).not.toEqual(movie.title)
})

test("update movie to title that exists", async () => {
    await shouldThrowWithCode(updateMovie, "P2002", {
        id: movie.id,
        title: movie1.title,
    })
})

test("delete movie", async () => {
    expect(deleteMovie(user.id, movie.id)).resolves.not.toThrowError()

    const uv = await prisma.userVote.findMany({
        where: {
            movieId: movie.id,
        },
    })
    expect(uv.length).toEqual(0)
})
test("get movie by Id that doesn't exist", async () => {
    const dbMovie = await getMovieById(movie.id)
    expect(dbMovie).toEqual(null)
})

test("update movie that doesn't exist", async () => {
    await shouldThrowWithCode(updateMovie, "P2025", {
        id: movie.id,
        title: "Hmmm new title",
    })
})

test("get movies by creator with no items", async () => {
    const dbMovies = await getMoviesByCreator(user.id)
    expect(dbMovies?.length).toEqual(0)
})

test("delete user with movie", async () => {
    await expect(deleteUser(user1.id)).resolves.not.toThrowError()
    const movies = await prisma.movie.findMany({
        where: { creatorId: user1.id },
    })
    expect(movies.length).toEqual(0)
})
