import argon2 from "argon2"

export const hash = async (password: string): Promise<string> => {
    const _password = password.slice()
    return argon2.hash(_password)
}

export const verify = async ({
    hashed,
    password,
}: {
    hashed: string
    password: string
}): Promise<boolean> => {
    const _password = password.slice()
    return argon2.verify(hashed, _password)
}
