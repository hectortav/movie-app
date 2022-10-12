import React from "react"
import { useRouter } from "next/router"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { Button } from "ui"

const fetchMe = async () => {
    const { data } = await axios.get("http://localhost:8080/user/me", {
        withCredentials: true,
    })
    return data
}

const fetchLogout = async () => {
    const { data } = await axios.post(
        "http://localhost:8080/user/logout",
        {},
        {
            withCredentials: true,
        }
    )
    return data
}

const Header = () => {
    const queryClient = useQueryClient()
    const router = useRouter()

    const [right, setRight] = React.useState<React.ReactNode>(
        <div className="flex">
            <a href="/register">
                <Button>Register</Button>
            </a>
        </div>
    )
    useQuery(["me"], () => fetchMe(), {
        onError: () => {},
        onSuccess: (data) => {
            setRight(
                <>
                    <div className="hidden no-underline hover:underline md:flex">
                        <a
                            href={`?userId=${data?.data?.id}`}
                        >{`${data?.data.firstname} ${data?.data.lastname}`}</a>
                    </div>
                    <div className="text-right text-red-500 no-underline hover:underline">
                        <button onClick={() => mutate()}>logout</button>
                    </div>
                </>
            )
        },
    })

    const { mutate } = useMutation(fetchLogout, {
        onSettled: () => {
            queryClient.invalidateQueries(["me"])
            queryClient.invalidateQueries(["movies"])
            router.push("/login")
        },
    })

    return (
        <nav className="flex h-[4rem] w-full items-center">
            <h1 className="mr-auto text-2xl no-underline hover:underline">
                <a href="/">MovieRama</a>
            </h1>
            <div className="ml-auto text-lg">{right}</div>
        </nav>
    )
}

export default Header
