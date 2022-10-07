import { Prisma } from "@prisma/client"
import prisma from "../lib"

type UserInput = Prisma.UserCreateInput | Omit<Prisma.UserCreateInput, "id">

export const createUser = async (
    user: UserInput
): Promise<Prisma.UserGroupByOutputType | undefined> => {
    return undefined
}

export const getUserById = async (
    id: string
): Promise<Prisma.UserGroupByOutputType | undefined> => {
    return undefined
}

export const getUserByEmail = async (
    email: string
): Promise<Prisma.UserGroupByOutputType | undefined> => {
    return undefined
}

export const updateUser = async (
    user: Prisma.UserUpdateInput & { id: string }
): Promise<Prisma.UserGroupByOutputType | undefined> => {
    return undefined
}

export const deleteUser = async (id: string): Promise<boolean> => {
    return false
}
