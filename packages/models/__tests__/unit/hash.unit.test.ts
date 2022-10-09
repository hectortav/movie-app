import { hash, verify } from "../../lib"

test("hash password and verify", async () => {
    const password = "mypassword"
    const hashed = await hash(password)
    const valid = await verify({ hashed, password })

    expect(valid).toEqual(true)
})

test("hash same password twice should give different result", async () => {
    const password = "mypassword"
    const hashed0 = await hash(password)
    const hashed1 = await hash(password)

    expect(hashed0).not.toEqual(hashed1)
})

test("hash password and verify with wrong password", async () => {
    const password = "mypassword"
    const hashed = await hash(password)
    const valid = await verify({ hashed, password: "randomtext" })

    expect(valid).toEqual(false)
})
