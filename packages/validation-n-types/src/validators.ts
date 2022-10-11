import { z } from "zod"

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

export const userInputModelValidator = userInputValidator
    .extend({
        id: id.optional(),
    })
    .strict()

export const userUpdateInputValidator = userInputValidator
    .partial()
    .omit({ email: true, password: true })
    .extend({ id })

export const userUpdateInputModelValidator = userUpdateInputValidator
