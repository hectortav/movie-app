import React from "react"
import { useRouter } from "next/router"
import axios from "axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { Button, Input } from "ui"
import { ModelError } from "validation-n-types"

const loginUser = async ({ email, password }: any) => {
    const data = await axios.post(
        "http://localhost:8080/user/login",
        {
            email,
            password,
        },
        {
            withCredentials: true,
        }
    )
    return data
}

interface LoginFormProps {
    email: string
    password: string
}

const Login = () => {
    const queryClient = useQueryClient()
    const router = useRouter()
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm()

    const { mutate } = useMutation(loginUser, {
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
    const onSubmit = (data: LoginFormProps) => {
        const { email, password } = data
        mutate({ email, password })
    }

    return (
        <div className="flex h-screen w-screen items-center justify-center">
            <form
                className="w-full max-w-lg overflow-hidden rounded border px-6 py-4 text-gray-700 shadow-lg"
                onSubmit={handleSubmit(onSubmit as any) as any}
            >
                <Input
                    name="email"
                    title="Email"
                    register={register}
                    errors={errors?.["email"]?.message as string}
                    placeholder="joedow@gmail.com"
                    type="text"
                />
                <Input
                    name="password"
                    title="Password"
                    register={register}
                    errors={errors?.["password"]?.message as string}
                    placeholder="******"
                    type="password"
                />

                <Button type="submit">Login</Button>
            </form>
        </div>
    )
}

export default Login
