import { z } from "zod"

export type AnyZodObject = z.AnyZodObject
export const str = z.string()
export const id = z.string()
export const email = z.string().email()
export const password = z
    .string()
    .regex(new RegExp(".*[A-Z].*"), "one uppercase character")
    .regex(new RegExp(".*[a-z].*"), "one lowercase character")
    .regex(new RegExp(".*\\d.*"), "one number")
    .regex(
        new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"),
        "one special character"
    )
    .min(6, "Must be at least 6 characters")

export const userInputValidator = z
    .object({
        email,
        firstname: z.string().min(2).max(24),
        lastname: z.string().min(2).max(24),
        password,
    })
    .strict()

export const userLoginValidator = z
    .object({
        email,
        password: z.string(),
    })
    .strict()

export const userUpdateInputValidator = userInputValidator
    .partial()
    .omit({ email: true, password: true })
    .extend({ id })
    .strict()

export const movieInputValidator = z
    .object({
        title: z.string().min(5).max(50),
        description: z.string().min(5).max(250),
    })
    .strict()

export const movieUpdateInputValidator = movieInputValidator
    .partial()
    .extend({ id })
    .strict()

export const userVoteInputValidator = z
    .object({
        vote: z.enum(["LIKES", "HATES"]),
    })
    .strict()

/* model */

export const userInputModelValidator = userInputValidator
    .extend({
        id: id.optional(),
    })
    .strict()

export const userUpdateInputModelValidator = userUpdateInputValidator

export const movieInputModelValidator = movieInputValidator
    .extend({
        id: id.optional(),
        creatorId: id,
    })
    .strict()

export const movieUpdateInputModelValidator = movieUpdateInputValidator

export const movieSortPropsModelValidator = z
    .object({
        param: z.enum(["likes", "hates", "createdAt"]),
        order: z.enum(["asc", "desc"]),
        userId: id,
    })
    .partial({ param: true, order: true, userId: true })
export const movieSortPropsValidator =
    movieSortPropsModelValidator.passthrough()

export const userVoteInputModelValidator = userVoteInputValidator
    .extend({
        userId: id,
        movieId: id,
    })
    .strict()
