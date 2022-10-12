import { z } from "zod"
import { ModelError } from "./types"

export const catchZodError = (e: z.ZodError): ModelError[] => {
    const errors: ModelError[] = []
    if (e instanceof z.ZodError) {
        e.issues.map(({ path, message }) => {
            errors.push({ field: path[0] as string, message })
        })
    }
    return errors
}
