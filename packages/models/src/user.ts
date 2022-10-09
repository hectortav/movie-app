import { v4 } from "uuid"
import { User, UserInput, UserUpdateInput } from "../types"
import { prisma, verify, hash } from "../lib"

export const createUser = async (user: UserInput): Promise<User | null> => {
    try {
        if (user.id === undefined) {
            user.id = v4()
        }
        return await prisma.user.create({
            data: {
                ...user,
                password: await hash(user.password),
            },
        })
    } catch (e: any) {
        throw e
    }
}

export const getUserById = async (id: User["id"]): Promise<User | null> => {
    try {
        return await prisma.user.findUnique({
            where: { id },
        })
    } catch (e: any) {
        /* istanbul ignore next */
        throw e
    }
}

export const getUserByEmail = async (
    email: User["email"]
): Promise<User | null> => {
    try {
        return await prisma.user.findUnique({
            where: { email },
        })
    } catch (e: any) {
        /* istanbul ignore next */
        throw e
    }
}

export const verifyUserWithIdPassword = async (
    id: User["id"],
    password: User["password"]
): Promise<boolean> => {
    const user = await getUserById(id)
    if (user === null) {
        return false
    }
    return verify({ hashed: user.password, password })
}

export const verifyUserWithEmailPassword = async (
    email: User["email"],
    password: User["password"]
): Promise<boolean> => {
    const user = await getUserByEmail(email)
    if (user === null) {
        return false
    }
    return verify({ hashed: user.password, password })
}

export const updateUser = async (
    user: UserUpdateInput
): Promise<User | null> => {
    try {
        return await prisma.user.update({
            where: { id: user.id },
            data: {
                ...user,
            },
        })
    } catch (e: any) {
        throw e
    }
}

export const updateUserWithVerification = async (
    oldpassword: User["password"],
    user: UserUpdateInput & {
        newPassword?: User["password"]
        email?: User["email"]
    }
): Promise<User | null> => {
    try {
        if (!(await verifyUserWithIdPassword(user.id, oldpassword))) {
            return null
        }
        let password = undefined
        if (user.newPassword !== undefined) {
            password = await hash(user.newPassword)
            user.newPassword = undefined
        }
        return await prisma.user.update({
            where: { id: user.id },
            data: {
                ...user,
                password,
            },
        })
    } catch (e: any) {
        throw e
    }
}

export const deleteUser = async (id: User["id"]): Promise<void> => {
    try {
        await prisma.user.delete({
            where: { id },
        })
    } catch (e: any) {
        throw e
    }
}
