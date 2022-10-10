import { v4 } from "uuid"
import { User, UserInput, UserUpdateInput, ModelResponseType } from "../types"
import { prisma, verify, hash } from "../lib"

export const createUser = async (
    user: UserInput
): Promise<ModelResponseType<User>> => {
    let response: ModelResponseType<User> = { data: null, errors: [] }
    try {
        if (user.id === undefined) {
            user.id = v4()
        }
        const dbUser = await prisma.user.create({
            data: {
                ...user,
                password: await hash(user.password),
            },
        })
        response.data = dbUser
        if (!dbUser) {
            response.errors.push({
                field: "userId",
                message: "could not create user",
            })
        }
        return response
    } catch (e: any) {
        if ((e as any).code === "P2002") {
            response.errors.push({
                field: "email",
                message: "email already in use",
            })
            return response
        }
        throw e
    }
}

export const getUserById = async (
    id: User["id"]
): Promise<ModelResponseType<User>> => {
    let response: ModelResponseType<User> = { data: null, errors: [] }
    try {
        const dbUser = await prisma.user.findUnique({
            where: { id },
        })
        response.data = dbUser
        if (!dbUser) {
            response.errors.push({
                field: "userId",
                message: "user does not exist",
            })
        }
        return response
    } catch (e: any) {
        /* istanbul ignore next */
        throw e
    }
}

export const getUserByEmail = async (
    email: User["email"]
): Promise<ModelResponseType<User>> => {
    let response: ModelResponseType<User> = { data: null, errors: [] }
    try {
        const dbUser = await prisma.user.findUnique({
            where: { email },
        })
        response.data = dbUser
        if (!dbUser) {
            response.errors.push({
                field: "email",
                message: "user does not exist",
            })
        }
        return response
    } catch (e: any) {
        /* istanbul ignore next */
        throw e
    }
}

export const verifyUserWithIdPassword = async (
    id: User["id"],
    password: User["password"]
): Promise<ModelResponseType<boolean>> => {
    let response: ModelResponseType<boolean> = { data: false, errors: [] }
    const user = await getUserById(id)
    response.errors = user.errors
    if (user.data === null) {
        response.errors.push({
            field: "userId",
            message: "user does not exist",
        })
        return response
    }
    response.data = await verify({ hashed: user.data.password, password })
    if (response.data === false) {
        response.errors.push({
            field: "password",
            message: "wrong password",
        })
    }
    return response
}

export const verifyUserWithEmailPassword = async (
    email: User["email"],
    password: User["password"]
): Promise<ModelResponseType<User["id"]>> => {
    let response: ModelResponseType<User["id"]> = { data: null, errors: [] }
    const user = await getUserByEmail(email)
    response.errors = user.errors
    if (user.data === null) {
        response.errors.push({
            field: "email",
            message: "email does not exist",
        })
        return response
    }
    if (await verify({ hashed: user.data.password, password })) {
        response.data = user.data.id
        return response
    } else {
        response.errors.push({
            field: "password",
            message: "wrong password",
        })
    }
    return response
}

const _updateUser = async (
    user: UserUpdateInput & {
        password?: User["password"]
        email?: User["email"]
    }
): Promise<ModelResponseType<User>> => {
    let response: ModelResponseType<User> = { data: null, errors: [] }
    try {
        const dbUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                ...user,
            },
        })
        response.data = dbUser
        if (!dbUser) {
            response.errors.push({
                field: "userId",
                message: "unknown error",
            })
            return response
        }
        return response
    } catch (e: any) {
        if ((e as any).code === "P2025") {
            response.errors.push({
                field: "userId",
                message: "user does not exist",
            })
            return response
        }
        if ((e as any).code === "P2002") {
            response.errors.push({
                field: "email",
                message: "email already in use",
            })
            return response
        }
        throw e
    }
}

export const updateUser = async (
    user: UserUpdateInput
): Promise<ModelResponseType<User>> => {
    return _updateUser(user)
}

export const updateUserWithVerification = async (
    oldpassword: User["password"],
    user: UserUpdateInput & {
        newPassword?: User["password"]
        email?: User["email"]
    }
): Promise<ModelResponseType<User>> => {
    let response: ModelResponseType<User> = { data: null, errors: [] }
    const valid = await verifyUserWithIdPassword(user.id, oldpassword)
    response.errors = valid.errors
    if (!valid.data) {
        return response
    }

    let password = undefined
    if (user.newPassword !== undefined) {
        password = await hash(user.newPassword)
        user.newPassword = undefined
    }
    const dbUser = await _updateUser({
        ...user,
        password,
    })

    response.errors = [...response.errors, ...dbUser.errors]
    response.data = dbUser.data
    return response
}

export const deleteUser = async (
    id: User["id"]
): Promise<ModelResponseType<void>> => {
    let response: ModelResponseType<void> = { data: undefined, errors: [] }
    try {
        const dbUser = await prisma.user.delete({
            where: { id },
        })
        if (!dbUser) {
            response.errors.push({
                field: "userId",
                message: "unknown error",
            })
            return response
        }
        return response
    } catch (e: any) {
        if ((e as any).code === "P2025") {
            response.errors.push({
                field: "userId",
                message: "user does not exist",
            })
            return response
        }
        throw e
    }
}
