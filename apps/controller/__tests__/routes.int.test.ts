import request from "supertest"
import server from "../src/server"
import { redis } from "../src/lib"

afterAll(async () => {
    redis.disconnect()
})

let myMovieId = ""
let otherMovieId = ""

test("view movies (not signed in)", async () => {
    const res = await request(server).get("/movies")

    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty("data")
})

test("view movies by user (not signed in)", async () => {
    const res = await request(server)
        .get("/movies")
        .query({ userId: "test-id" })

    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty("data")
})

test("view movies sorted by likes ASC (not signed in)", async () => {
    const res = await request(server)
        .get("/movies")
        .query({ param: "likes", order: "asc" })

    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty("data")
})

test("view movies sorted by likes ASC (not signed in)", async () => {
    const res = await request(server)
        .get("/movies")
        .query({ param: "likes", order: "asc" })

    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty("data")
})

test("create movie (not signed in)", async () => {
    const res = await request(server).post("/movies").send({
        title: "A new movie title from supertest",
        description: "And the movie description",
    })

    expect(res.statusCode).toEqual(401)
    expect(res.body).not.toHaveProperty("data")
})

it("register", async () => {
    const res = await request(server).post("/user/register").send({
        firstname: "Jane",
        lastname: "Doe",
        email: "janedoefromexpress@gmail.com",
        password: "th1sismyP@ssword",
    })
    expect(res.statusCode).toEqual(200)
    expect(res.headers["set-cookie"].length).toEqual(1)
})

describe("Authorization", () => {
    it("create movie (signed in)", async () => {
        let res = await request(server).post("/user/login").send({
            email: "janedoefromexpress@gmail.com",
            password: "th1sismyP@ssword",
        })

        res = await request(server)
            .post("/movies")
            .set("Cookie", [res.headers["set-cookie"]])
            .send({
                title: "A new movie title",
                description: "And the movie description",
            })

        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty("data")
        myMovieId = res.body.data.id
    })
})

describe("Authorization", () => {
    it("logout", async () => {
        let res = await request(server).post("/user/login").send({
            email: "janedoefromexpress@gmail.com",
            password: "th1sismyP@ssword",
        })

        expect(res.statusCode).toEqual(200)
        expect(res.headers["set-cookie"].length).toEqual(1)

        res = await request(server)
            .post("/user/logout")
            .set("Cookie", [res.headers["set-cookie"]])
            .send({})
        expect(res.statusCode).toEqual(200)
    })
})

test("vote for movie (not signed in)", async () => {
    const movieId = "test-movieId"
    const res = await request(server).post(`/movies/${movieId}`).send({
        vote: "LIKES",
    })

    expect(res.statusCode).toEqual(401)
    expect(res.body).not.toHaveProperty("data")
})

describe("Authorization", () => {
    it("vote for movie that is mine", async () => {
        let res = await request(server).post("/user/register").send({
            firstname: "John",
            lastname: "Doe",
            email: "johndoefromexpress@gmail.com",
            password: "th1sismyP@ssword",
        })
        const cookie = res.headers["set-cookie"]
        res = await request(server)
            .post("/movies")
            .set("Cookie", [cookie])
            .send({
                title: "A new movie title from supertest 2",
                description: "And the movie description",
            })

        otherMovieId = res.body.data.id

        res = await request(server)
            .post(`/movies/${otherMovieId}`)
            .set("Cookie", [cookie])
            .send({
                vote: "LIKES",
            })

        expect(res.statusCode).toEqual(422)
        expect(res.body.data).toEqual(null)
    })
})

describe("Authorization", () => {
    it("vote for movie", async () => {
        let res = await request(server).post("/user/login").send({
            email: "janedoefromexpress@gmail.com",
            password: "th1sismyP@ssword",
        })

        res = await request(server)
            .post(`/movies/${otherMovieId}`)
            .set("Cookie", [res.headers["set-cookie"]])
            .send({
                vote: "LIKES",
            })

        expect(res.statusCode).toEqual(200)
    })
})
