import { v4 } from "uuid"
import * as v from "validation-n-types"
import { User, UserInput, UserUpdateInput, ModelResponseType } from "../types"
import { prisma, verify, hash } from "../lib"

export const createUser = async (
    user: UserInput
): Promise<ModelResponseType<User>> => {
    let response: ModelResponseType<User> = { data: null, errors: [] }
    try {
        v.userInputModelValidator.parse(user)
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
        const verrors = v.catchZodError(e)
        /* prettier-ignore */
        if (verrors.length > 0) { return { data: response.data, errors: [...response.errors, ...verrors], } }
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
    v.id.parse(id)
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
        const verrors = v.catchZodError(e)
        /* prettier-ignore */
        if (verrors.length > 0) { return { data: response.data, errors: [...response.errors, ...verrors], } }

        /* istanbul ignore next */
        throw e
    }
}

export const getUserByEmail = async (
    email: User["email"]
): Promise<ModelResponseType<User>> => {
    let response: ModelResponseType<User> = { data: null, errors: [] }
    v.email.parse(email)
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
        const verrors = v.catchZodError(e)
        /* prettier-ignore */
        if (verrors.length > 0) { return { data: response.data, errors: [...response.errors, ...verrors], } }
        /* istanbul ignore next */
        throw e
    }
}

export const verifyUserWithIdPassword = async (
    id: User["id"],
    password: User["password"]
): Promise<ModelResponseType<boolean>> => {
    let response: ModelResponseType<boolean> = { data: false, errors: [] }
    try {
        v.id.parse(id)
        v.str.parse(password)
    } catch (e: any) {
        const verrors = v.catchZodError(e)
        /* prettier-ignore */
        if (verrors.length > 0) { return { data: response.data, errors: [...response.errors, ...verrors], } }
    }
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
    try {
        v.email.parse(email)
        v.str.parse(password)
    } catch (e: any) {
        const verrors = v.catchZodError(e)
        /* prettier-ignore */
        if (verrors.length > 0) { return { data: response.data, errors: [...response.errors, ...verrors], } }
    }
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
    let response: ModelResponseType<User> = { data: null, errors: [] }
    try {
        v.userUpdateInputModelValidator.parse(user)
    } catch (e: any) {
        const verrors = v.catchZodError(e)
        /* prettier-ignore */
        if (verrors.length > 0) { return { data: response.data, errors: [...response.errors, ...verrors], } }
        throw e
    }
    response = await _updateUser(user)
    return response
}

export const updateUserWithVerification = async (
    oldpassword: User["password"],
    user: UserUpdateInput & {
        newPassword?: User["password"]
        email?: User["email"]
    }
): Promise<ModelResponseType<User>> => {
    let response: ModelResponseType<User> = { data: null, errors: [] }
    try {
        v.userUpdateInputModelValidator
            .extend({
                newPassword: v.password.optional(),
                email: v.email.optional(),
                password: v.str.optional(),
            })
            .strict()
            .parse(user)
    } catch (e: any) {
        const verrors = v.catchZodError(e)
        /* prettier-ignore */
        if (verrors.length > 0) { return { data: response.data, errors: [...response.errors, ...verrors], } }
        throw e
    }

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
        v.id.parse(id)
        const dbUser = await prisma.user.delete({
            where: { id },
        })
        if (!dbUser) {
            response.errors.push({
                field: "userId",
                message: "unknown error",
            })
        }
        return response
    } catch (e: any) {
        const verrors = v.catchZodError(e)
        /* prettier-ignore */
        if (verrors.length > 0) { return { data: response.data, errors: [...response.errors, ...verrors], } }
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
