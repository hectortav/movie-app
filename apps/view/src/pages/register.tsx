import React from "react"
import { useRouter } from "next/router"
import axios from "axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { Button, Input } from "ui"
import { ModelError } from "validation-n-types"

const createUser = async ({ firstname, lastname, email, password }: any) => {
    const data = await axios.post(
        "http://localhost:8080/user/register",
        {
            firstname,
            lastname,
            email,
            password,
        },
        {
            withCredentials: true,
        }
    )
    return data
}

interface RegisterFormProps {
    firstname: string
    lastname: string
    email: string
    password: string
    "confirm-password": string
}

const Register = () => {
    const queryClient = useQueryClient()
    const router = useRouter()
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm()

    const { mutate } = useMutation(createUser, {
        onSuccess: () => {
            queryClient.invalidateQueries(["me"])
            router.push("/")
        },
        onError: (error: any) => {
            error.response.data.errors.forEach((error: ModelError) => {
                setError(error.field, {
                    type: "custom",
                    message: error.message,
                })
            })
        },
    })
    const onSubmit = (data: RegisterFormProps) => {
        if (data["password"] !== data["confirm-password"]) {
            setError("confirm-password", {
                type: "custom",
                message: "custom message",
            })
            return
        }
        const { firstname, lastname, email, password } = data
        mutate({ firstname, lastname, email, password })
    }

    return (
        <div className="flex h-screen w-screen items-center justify-center">
            <form
                className="w-full max-w-lg overflow-hidden rounded border px-6 py-4 text-gray-700 shadow-lg"
                onSubmit={handleSubmit(onSubmit as any) as any}
            >
                <Input
                    name="firstname"
                    title="First name"
                    register={register}
                    errors={errors?.["firstname"]?.message}
                    placeholder="Jane"
                    type="text"
                    half
                />
                <Input
                    name="lastname"
                    title="Last name"
                    register={register}
                    errors={errors?.["lastname"]?.message}
                    placeholder="Doe"
                    type="text"
                    hald
                />
                <Input
                    name="email"
                    title="Email"
                    register={register}
                    errors={errors?.["email"]?.message}
                    placeholder="joedow@gmail.com"
                    type="text"
                />
                <Input
                    name="password"
                    title="Password"
                    register={register}
                    errors={errors?.["password"]?.message}
                    placeholder="******"
                    type="password"
                />
                <Input
                    name="confirm-password"
                    title="Confirm password"
                    register={register}
                    errors={errors?.["confirm-password"]?.message}
                    placeholder="******"
                    type="password"
                />
                <Button type="submit">Register</Button>
            </form>
        </div>
    )
}

export default Register
