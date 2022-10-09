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
import { shouldThrowWithCode } from "../utils"

const TEST_ID = "user"

const user = {
    id: `${TEST_ID}_user_0000`,
    firstname: "Jane",
    lastname: "Doe",
    email: `janedoe${TEST_ID}@gmail.com`,
    password: "thisismypassword",
}

test("delete user that doesn't exist", async () => {
    await shouldThrowWithCode(deleteUser, "P2025", user.id)
})

test("create user", async () => {
    const dbUser = await createUser(user)
    expect(dbUser).not.toEqual(null)
})

test("verify user with Id", async () => {
    const res = await verifyUserWithIdPassword(user.id, user.password)
    expect(res).toEqual(true)
})

test("verify user with Email", async () => {
    const res = await verifyUserWithEmailPassword(user.email, user.password)
    expect(res).toEqual(user.id)
})

test("verify user wrong Id", async () => {
    const res = await verifyUserWithIdPassword("awrongid", user.password)
    expect(res).toEqual(false)
})

test("verify user wrong Email", async () => {
    const res = await verifyUserWithEmailPassword("awrongemail", user.password)
    expect(res).toEqual(null)
})

test("verify user with Id but wrong password", async () => {
    const res = await verifyUserWithIdPassword(user.id, "wrond password")
    expect(res).toEqual(false)
})

test("verify user with Email but wrong password", async () => {
    const res = await verifyUserWithEmailPassword(user.email, "wrond password")
    expect(res).toEqual(null)
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
    await shouldThrowWithCode(createUser, "P2002", user)
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

test("update user password", async () => {
    const dbUser = await updateUserWithVerification(user.password, {
        id: user.id,
        firstname: "Maria",
        newPassword: user.password.toUpperCase(),
    })
    expect(dbUser?.firstname).toEqual("Maria")
})

test("update user Email with wrong password", async () => {
    const dbUser = await updateUserWithVerification("wrong password", {
        id: user.id,
        email: "email@gmail.com",
    })
    expect(dbUser).toEqual(null)
})

test("update user Email with Email that exists", async () => {
    await shouldThrowWithCode(
        updateUserWithVerification,
        "P2002",
        user.password.toUpperCase(),
        {
            id: user.id,
            email: "randomemail@gmail.com",
        }
    )
})

test("delete user", async () => {
    await expect(deleteUser(user.id)).resolves.not.toThrowError()
})

test("get user by Id that doesn't exist", async () => {
    const dbUser = await getUserById(user.id)
    expect(dbUser).toEqual(null)
})

test("get user by Email that doesn't exist", async () => {
    const dbUser = await getUserByEmail(user.email)
    expect(dbUser).toEqual(null)
})

test("update user Email that doesn't exist", async () => {
    const dbUser = await updateUserWithVerification(user.password, {
        id: user.id,
        email: "email@gmail.com",
    })
    expect(dbUser).toEqual(null)
})

test("update user that doesn't exist", async () => {
    await shouldThrowWithCode(updateUser, "P2025", {
        id: user.id,
        firstname: "Jane Mary",
    })
})
