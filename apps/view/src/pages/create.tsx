import React from "react"
import { useRouter } from "next/router"
import axios from "axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { Button, Input } from "ui"
import { ModelError } from "validation-n-types"

const createMovie = async ({ title, description }: CreateFormProps) => {
    const data = await axios.post(
        "http://localhost:8080/movies",
        {
            title,
            description,
        },
        {
            withCredentials: true,
        }
    )
    return data
}

interface CreateFormProps {
    title: string
    description: string
}

const Create = () => {
    const queryClient = useQueryClient()
    const router = useRouter()
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm()

    const { mutate } = useMutation(createMovie, {
        onSuccess: () => {
            queryClient.invalidateQueries(["movies"])
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
    const onSubmit = (data: CreateFormProps) => {
        const { title, description } = data
        mutate({ title, description })
    }

    return (
        <div className="flex h-screen w-screen items-center justify-center">
            <form
                className="w-full max-w-lg overflow-hidden rounded border px-6 py-4 text-gray-700 shadow-lg"
                onSubmit={handleSubmit(onSubmit as any) as any}
            >
                <Input
                    name="title"
                    title="Title"
                    register={register}
                    errors={errors?.["title"]?.message}
                    placeholder="Your movie title"
                    type="text"
                />
                <Input
                    name="description"
                    title="description"
                    register={register}
                    errors={errors?.["description"]?.message}
                    placeholder="Your description"
                    type="text"
                    multiline
                />

                <Button type="submit">Create movie</Button>
            </form>
        </div>
    )
}

export default Create
