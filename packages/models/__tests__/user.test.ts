import {
    createUser,
    getUserById,
    getUserByEmail,
    updateUser,
    deleteUser,
} from "../src"

const TEST_NUM = 0

const user = {
    id: `${TEST_NUM}_user_0000`,
    firstname: "Jane",
    lastname: "Doe",
    email: "janedoe@gmail.com",
    password: "thisismypassword",
}

test("delete user that doesn't exist", async () => {
    const res = await deleteUser(user.id)
    expect(res).toEqual(false)
})

test("create user", async () => {
    const dbUser = await createUser(user)
    expect(dbUser).not.toEqual(undefined)
})

test("create user that exists", async () => {
    const dbUser = await createUser(user)
    expect(dbUser).toEqual(undefined)
})

test("get user by Id", async () => {
    const dbUser = await getUserById(user.id)
    expect(dbUser?.firstname).toEqual(user.firstname)
})

test("get user by Email", async () => {
    const dbUser = await getUserByEmail(user.email)
    expect(dbUser?.id).toEqual(user.id)
})

test("update user", async () => {
    const dbUser = await updateUser({ id: user.id, firstname: "Jane Mary" })
    expect(dbUser?.firstname).not.toEqual(user.firstname)
})

test("delete user", async () => {
    const res = await deleteUser(user.id)
    expect(res).toEqual(true)
})
test("get user by Id that doesn't exist", async () => {
    const dbUser = await getUserById(user.id)
    expect(dbUser).toEqual(undefined)
})

test("get user by Email that doesn't exist", async () => {
    const dbUser = await getUserByEmail(user.email)
    expect(dbUser).toEqual(undefined)
})

test("update user that doesn't exist", async () => {
    const dbUser = await updateUser({ id: user.id, firstname: "Jane Mary" })
    expect(dbUser).toEqual(undefined)
})
