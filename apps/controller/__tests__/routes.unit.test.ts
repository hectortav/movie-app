import request from "supertest"
import server from "../src/server"

test("view movies (not signed in)", async () => {
    const res = await request(server).get("/movie")

    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty("movies")
})

test("view movies by user (not signed in)", async () => {
    const res = await request(server).get("/movie").query({ userId: "test-id" })

    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty("movies")
})

test("view movies sorted by likes ASC (not signed in)", async () => {
    const res = await request(server)
        .get("/movie")
        .query({ param: "likes", order: "asc" })

    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty("movies")
})

test("view movies sorted by likes ASC (not signed in)", async () => {
    const res = await request(server)
        .get("/movie")
        .query({ param: "likes", order: "asc" })

    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty("movies")
})

test("create movie (not signed in)", async () => {
    const res = await request(server).post("/movie").send({
        title: "A new movie title",
        description: "And the movie description",
    })

    expect(res.statusCode).toEqual(401)
    expect(res.body).not.toHaveProperty("movie")
})

test("register", async () => {
    const res = await request(server).post("/user/register").send({
        firstname: "Jane",
        lastname: "Doe",
        email: "janedoe@gmail.com",
        password: "thisismypassword",
    })

    expect(res.statusCode).toEqual(200)
})

test("create movie (signed in)", async () => {
    const res = await request(server).post("/movie").send({
        title: "A new movie title",
        description: "And the movie description",
    })

    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty("movie")
})

test("logout", async () => {
    const res = await request(server).post("/user/logout").send({})
    expect(res.statusCode).toEqual(200)
})

test("vote for movie (not signed in)", async () => {
    const movieId = "test-movieId"
    const res = await request(server).post(`/movie/${movieId}`).send({
        vote: "LIKE",
    })

    expect(res.statusCode).toEqual(401)
    expect(res.body).not.toHaveProperty("movie")
})

test("login", async () => {
    const res = await request(server).post("/user/login").send({
        email: "janedoe@gmail.com",
        password: "thisismypassword",
    })

    expect(res.statusCode).toEqual(200)
})

test("vote for movie that is mine", async () => {
    const movieId = "test-movieId"
    const res = await request(server).post(`/movie/${movieId}`).send({
        vote: "LIKE",
    })

    expect(res.statusCode).toEqual(405)
    expect(res.body).not.toHaveProperty("movie")
})

test("vote for movie", async () => {
    const movieId = "test-movieId"
    const res = await request(server).post(`/movie/${movieId}`).send({
        vote: "LIKE",
    })

    expect(res.statusCode).toEqual(200)
    expect(res.body).not.toHaveProperty("movie")
})
