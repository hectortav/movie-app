import {
    createUser,
    getUserById,
    getUserByEmail,
    verifyUserWithIdPassword,
    verifyUserWithEmailPassword,
    updateUser,
    updateUserWithVerification,
    deleteUser,
} from "../../src"
import { containsField } from "../utils"

const TEST_ID = "user"

const user = {
    id: `${TEST_ID}_user_0000`,
    firstname: "Jane",
    lastname: "Doe",
    email: `janedoe${TEST_ID}@gmail.com`,
    password: "th1sismyP@ssword",
}

test("delete user that doesn't exist", async () => {
    const dbUser = await deleteUser(user.id)
    expect(containsField(dbUser.errors, "userId")).toEqual(true)
})

test("create user", async () => {
    const dbUser = await createUser(user)
    expect(dbUser.errors.length).toEqual(0)
})

test("verify user with Id", async () => {
    const dbUser = await verifyUserWithIdPassword(user.id, user.password)
    expect(dbUser.data).toEqual(true)
})

test("verify user with Email", async () => {
    const dbUser = await verifyUserWithEmailPassword(user.email, user.password)
    expect(dbUser.data).toEqual(user.id)
})

test("verify user wrong Id", async () => {
    const dbUser = await verifyUserWithIdPassword("awrongid", user.password)
    expect(containsField(dbUser.errors, "userId")).toEqual(true)
})

test("verify user wrong Email", async () => {
    const dbUser = await verifyUserWithEmailPassword(
        "awrongemail@gmail.com",
        user.password
    )
    expect(containsField(dbUser.errors, "email")).toEqual(true)
})

test("verify user with Id but wrong password", async () => {
    const dbUser = await verifyUserWithIdPassword(user.id, "wrondpassword")
    expect(containsField(dbUser.errors, "password")).toEqual(true)
})

test("verify user with Email but wrong password", async () => {
    const dbUser = await verifyUserWithEmailPassword(
        user.email,
        "wrondpassword"
    )
    expect(containsField(dbUser.errors, "password")).toEqual(true)
})

test("create user without Id", async () => {
    const dbUser = await createUser({
        ...user,
        id: undefined,
        email: "randomemail@gmail.com",
    })
    expect(dbUser).not.toEqual(null)
})

test("create user that exists", async () => {
    const dbUser = await createUser(user)
    expect(containsField(dbUser.errors, "email")).toEqual(true)
})

test("get user by Id", async () => {
    const dbUser = await getUserById(user.id)
    expect(dbUser.data?.firstname).toEqual(user.firstname)
})

test("get user by Email", async () => {
    const dbUser = await getUserByEmail(user.email)
    expect(dbUser.data?.id).toEqual(user.id)
})

test("update user", async () => {
    const dbUser = await updateUser({ id: user.id, firstname: "Jane Mary" })
    expect(dbUser.data?.firstname).not.toEqual(user.firstname)
})

test("update user password", async () => {
    const dbUser = await updateUserWithVerification(user.password, {
        id: user.id,
        firstname: "Maria",
        newPassword: user.password.toUpperCase() + "m",
    })
    expect(dbUser.data?.firstname).toEqual("Maria")
})

test("update user Email with wrong password", async () => {
    const dbUser = await updateUserWithVerification("wrongpassword", {
        id: user.id,
        email: "email@gmail.com",
    })
    expect(containsField(dbUser.errors, "password")).toEqual(true)
})

test("update user Email with Email that exists", async () => {
    const dbUser = await updateUserWithVerification(
        user.password.toUpperCase() + "m",
        {
            id: user.id,
            email: "randomemail@gmail.com",
        }
    )
    expect(containsField(dbUser.errors, "email")).toEqual(true)
})

test("delete user", async () => {
    const dbUser = await deleteUser(user.id)
    expect(dbUser.errors.length).toEqual(0)
})

test("get user by Id that doesn't exist", async () => {
    const dbUser = await getUserById(user.id)
    expect(containsField(dbUser.errors, "userId")).toEqual(true)
})

test("get user by Email that doesn't exist", async () => {
    const dbUser = await getUserByEmail(user.email)
    expect(containsField(dbUser.errors, "email")).toEqual(true)
})

test("update user Email that doesn't exist", async () => {
    const dbUser = await updateUserWithVerification(user.password, {
        id: user.id,
        email: "email@gmail.com",
    })
    expect(containsField(dbUser.errors, "userId")).toEqual(true)
})

test("update user that doesn't exist", async () => {
    const dbUser = await updateUser({
        id: user.id,
        firstname: "Jane Mary",
    })
    expect(containsField(dbUser.errors, "userId")).toEqual(true)
})
