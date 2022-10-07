export type { User } from "@prisma/client"
export { PrismaClientKnownRequestError as ClientKnownRequestError } from "@prisma/client"
import type { User, PrismaClientKnownRequestError } from "@prisma/client"

type Optional<Type, Key extends keyof Type> = Omit<Type, Key> &
    Partial<Pick<Type, Key>>
export type UserIdInput = Omit<User, "createdAt" | "updatedAt">
export type UserInput = Optional<UserIdInput, "id">
export type UserUpdateInput = Omit<
    Partial<UserIdInput> & { id: typeof User.id },
    "password" | "email"
>
