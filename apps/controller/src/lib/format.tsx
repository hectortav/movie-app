import { ModelError } from "types"

export const formatErrors = (errors: ModelError[]) => {
    const found = [-1, -1]
    const output = []
    errors.map(({ field, message }, i) => {
        if (field === "password" && message.includes("wrong")) {
            found[0] = i
        } else if (field === "email" && message.includes("wrong")) {
            found[0] = i
            found[1] = i
            errors.slice(i, 1)
        } else {
            output.push({ field, message })
        }
    })
    if (found[0] || found[1]) {
        output.push({ field: "email", message: "wrond email or password" })
    }
    return output
}
