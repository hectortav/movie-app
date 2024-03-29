import {
    createUser,
    createMovie,
    getMovieById,
    getAllMoviesSortedBy,
    updateMovie,
    deleteMovie,
    deleteUser,
} from "../../src"
import { containsField } from "../utils"

import { prisma } from "../../lib"

const TEST_ID = "movie"

const user = {
    id: `${TEST_ID}_user_0000`,
    firstname: "Jane",
    lastname: "Doe",
    email: `janedoe${TEST_ID}@gmail.com`,
    password: "th1sismyP@ssword",
}

const user1 = {
    id: `${TEST_ID}_user_0001`,
    firstname: "John",
    lastname: "Doe",
    email: `johndoe${TEST_ID}@gmail.com`,
    password: "th1sismyP@ssword",
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
    expect(dbMovie.errors.length).toEqual(0)
})

test("create movie without id and create two votes", async () => {
    const dbMovie = await createMovie({ ...movie1, id: undefined })
    expect(dbMovie.errors.length).toEqual(0)

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

    const dbUserVotes = await prisma.userVote.findMany({
        where: { movieId: movie.id },
    })
    expect(dbUserVotes.length).toEqual(2)
})

test("create movie that exists", async () => {
    const dbMovie = await createMovie(movie)
    expect(containsField(dbMovie.errors, "title")).toEqual(true)
})

test("get movie by Id", async () => {
    const dbMovie = await getMovieById(movie.id)
    expect(dbMovie.data?.title).toEqual(movie.title)
})

test("get all movies", async () => {
    const dbMovies = await getAllMoviesSortedBy({})
    expect(dbMovies.data?.length).toBeGreaterThanOrEqual(2)
})

test("get all movies sort by Likes descending", async () => {
    const dbMovies = await getAllMoviesSortedBy({
        param: "likes",
        order: "desc",
    })

    expect(dbMovies.errors.length).toEqual(0)
    expect(dbMovies.data).not.toEqual(null)
    if (dbMovies.data === null) {
        return
    }
    expect(dbMovies.data[0].likes).toBeGreaterThanOrEqual(
        dbMovies.data[1].likes
    )
})

test("get all movies sort by Likes ascending", async () => {
    const dbMovies = await getAllMoviesSortedBy({
        param: "likes",
        order: "asc",
    })

    expect(dbMovies.errors.length).toEqual(0)
    expect(dbMovies.data).not.toEqual(null)
    if (dbMovies.data === null) {
        return
    }
    expect(dbMovies.data[1].likes).toBeGreaterThanOrEqual(
        dbMovies.data[0].likes
    )
})

test("get all movies sort by Hates descending", async () => {
    const dbMovies = await getAllMoviesSortedBy({
        param: "hates",
        order: "desc",
    })
    expect(dbMovies.errors.length).toEqual(0)
    expect(dbMovies.data).not.toEqual(null)
    if (dbMovies.data === null) {
        return
    }
    expect(dbMovies.data[0].hates).toBeGreaterThanOrEqual(
        dbMovies.data[1].hates
    )
})

test("get all movies sort by Hates ascending", async () => {
    const dbMovies = await getAllMoviesSortedBy({
        param: "hates",
        order: "asc",
    })
    expect(dbMovies.errors.length).toEqual(0)
    expect(dbMovies.data).not.toEqual(null)
    if (dbMovies.data === null) {
        return
    }
    expect(dbMovies.data[1].hates).toBeGreaterThanOrEqual(
        dbMovies.data[0].hates
    )
})

test("get all movies sort by createdAt descending", async () => {
    const dbMovies = await getAllMoviesSortedBy({
        param: "createdAt",
        order: "desc",
    })

    expect(dbMovies.errors.length).toEqual(0)
    expect(dbMovies.data).not.toEqual(null)
    if (dbMovies.data === null) {
        return
    }
    expect(dbMovies.data[0].createdAt.getTime()).toBeGreaterThanOrEqual(
        dbMovies.data[1].createdAt.getTime()
    )
})

test("get all movies sort by createdAt ascending", async () => {
    const dbMovies = await getAllMoviesSortedBy({
        param: "createdAt",
        order: "asc",
    })
    expect(dbMovies.errors.length).toEqual(0)
    expect(dbMovies.data).not.toEqual(null)
    if (dbMovies.data === null) {
        return
    }
    expect(dbMovies.data[1].createdAt.getTime()).toBeGreaterThanOrEqual(
        dbMovies.data[0].createdAt.getTime()
    )
})

test("update movie", async () => {
    const dbMovie = await updateMovie({
        id: movie.id,
        title: "A new title for this movie!",
    })
    expect(dbMovie.data?.title).not.toEqual(movie.title)
})

test("update movie to title that exists", async () => {
    const dbMovie = await updateMovie({
        id: movie.id,
        title: movie1.title,
    })
    expect(containsField(dbMovie.errors, "title")).toEqual(true)
})

test("delete movie", async () => {
    const dbMovie = await deleteMovie(user.id, movie.id)
    expect(dbMovie.errors.length).toEqual(0)

    const uv = await prisma.userVote.findMany({
        where: {
            movieId: movie.id,
        },
    })
    expect(uv.length).toEqual(0)
})
test("get movie by Id that doesn't exist", async () => {
    const dbMovie = await getMovieById(movie.id)
    expect(containsField(dbMovie.errors, "movieId")).toEqual(true)
})

test("update movie that doesn't exist", async () => {
    const dbMovie = await updateMovie({
        id: movie.id,
        title: "Hmmm new title",
    })
    expect(containsField(dbMovie.errors, "movieId")).toEqual(true)
})

test("get movies by creator with no items", async () => {
    const dbMovies = await getAllMoviesSortedBy({ userId: user.id })
    expect(dbMovies.data?.length).toEqual(0)
})

test("delete user with movie", async () => {
    const dbUser = await deleteUser(user1.id)
    expect(dbUser.errors.length).toEqual(0)

    const movies = await prisma.movie.findMany({
        where: { creatorId: user1.id },
    })
    expect(movies.length).toEqual(0)
})
