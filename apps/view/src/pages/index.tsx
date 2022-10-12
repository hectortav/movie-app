import React from "react"
import { useRouter } from "next/router"
import { Card } from "ui"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { Layout, SortButtons } from "../components"

interface FetchMoviesProps {
    param: string
    order: string
    userId: string
}

const fetchMovies = async ({ param, order, userId }: FetchMoviesProps) => {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API}/movies`, {
        params: {
            param,
            order,
            userId,
        },
        withCredentials: true,
    })
    return data
}

const vote = async ({ id, vote }: { id: string; vote: "LIKES" | "HATES" }) => {
    const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/movies/${id}`,
        {
            vote,
        },
        {
            withCredentials: true,
        }
    )
    return data
}

export default function Web() {
    const router = useRouter()
    const queryClient = useQueryClient()
    const { data, isLoading, refetch } = useQuery(["movies"], () =>
        fetchMovies({ ...router.query } as unknown as FetchMoviesProps)
    )

    const { mutate } = useMutation(vote, {
        onSuccess: () => {
            queryClient.invalidateQueries(["movies"])
            refetch()
        },
    })

    React.useEffect(() => {
        refetch()
    }, [router.query, refetch])

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <Layout>
            <SortButtons />
            <div className="h-[2rem]" />
            <section className="flex flex-col items-center justify-center">
                {data?.data?.map((movie: Record<string, string | number>) => (
                    //@ts-ignore
                    <Card
                        key={movie.id}
                        {...movie}
                        style={{ marginBottom: "1rem" }}
                        onLike={() =>
                            mutate({ id: movie.id as string, vote: "LIKES" })
                        }
                        onHate={() =>
                            mutate({ id: movie.id as string, vote: "HATES" })
                        }
                    />
                ))}
                <div className="mt-8" />
            </section>
        </Layout>
    )
}
