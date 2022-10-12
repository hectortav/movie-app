import React from "react"
import { useRouter } from "next/router"
import { Card, Button } from "ui"
import { useQuery, useQueryClient } from "@tanstack/react-query"

import axios from "axios"

const fetchMovies = async ({
    param,
    order,
    userId,
}: {
    param: string
    order: string
    userId: string
}) => {
    const { data } = await axios.get("http://localhost:8080/movies", {
        params: {
            param,
            order,
            userId,
        },
    })
    return data
}

const fetchMe = async () => {
    const { data } = await axios.get("http://localhost:8080/user/me", {
        withCredentials: true,
    })
    return data
}

const Arrow = ({
    rotate = false,
    active = false,
}: {
    rotated?: boolean
    active?: boolean
}) => (
    <svg
        className={`ml-2 h-4 w-4 ${active && rotate && "rotate-180"}`}
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
        ></path>
    </svg>
)

export default function Web() {
    const router = useRouter()
    const queryClient = useQueryClient()
    const [param, setParam] = React.useState<
        "likes" | "hates" | "createdAt" | undefined
    >(undefined)
    const [order, setOrder] = React.useState<"asc" | "desc" | undefined>(
        undefined
    )

    React.useEffect(() => {
        if (param && order) {
            router.replace({ query: { ...router.query, param, order } })
        }
    }, [param, order])

    const { data, isLoading, refetch } = useQuery(["movies"], () =>
        fetchMovies({ ...router.query })
    )
    React.useEffect(() => {
        setParam(router.query.param)
        setOrder(router.query.order)
        queryClient.invalidateQueries(["movies"])
        refetch()
    }, [router.query])

    if (isLoading) {
        return <div>Loading...</div>
    }
    const onClick = (p: string) =>
        param === p
            ? order === "asc"
                ? setOrder("desc")
                : setOrder("asc")
            : setParam(p)
    return (
        <div>
            <header>
                <h1 className="text-2xl">MovieRama</h1>
                <div className="grid grid-cols-3 gap-4">
                    <Button
                        onClick={() => onClick("likes")}
                        active={param === "likes" ? 1 : 0}
                    >
                        <>
                            Likes
                            <Arrow
                                active={param === "likes" ? 1 : 0}
                                rotate={order === "desc"}
                            />
                        </>
                    </Button>
                    <Button
                        onClick={() => onClick("hates")}
                        active={param === "hates" ? 1 : 0}
                    >
                        <>
                            Hates
                            <Arrow
                                active={param === "hates" ? 1 : 0}
                                rotate={order === "desc"}
                            />
                        </>
                    </Button>
                    <Button
                        onClick={() => onClick("createdAt")}
                        active={param === "createdAt" ? 1 : 0}
                    >
                        <>
                            Created at
                            <Arrow
                                active={param === "createdAt" ? 1 : 0}
                                rotate={order === "desc"}
                            />
                        </>
                    </Button>
                </div>
            </header>
            <Me />
            <section>
                {data.data.map((movie: Record<string, string | number>) => (
                    <Card
                        key={movie.title}
                        {...movie}
                        // @ts-ignore
                        style={{ marginBottom: "1rem" }}
                    />
                ))}
                <div className="mt-8" />
            </section>
        </div>
    )
}

const Me = () => {
    const { data, isLoading } = useQuery(["me"], () => fetchMe())
    if (isLoading) {
        return <div>Loading...</div>
    }
    return <span>{`${data?.data.firstname} ${data?.data.lastname}`}</span>
}
