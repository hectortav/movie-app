import { formatErrors } from "../src/lib"

test("format errors", async () => {
    const errors = [
        { field: "email", message: "wrong emaill" },
        { field: "password", message: "wrong password" },
        { field: "userId", message: "wrong userId" },
    ]

    expect(formatErrors(errors).length).toEqual(2)
    expect(formatErrors(errors)[0].field).toEqual("userId")
    expect(formatErrors(errors)[1].field).toEqual("email")
})
