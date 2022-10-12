import React from "react"
import { useRouter } from "next/router"
import { Button } from "ui"
import { useQueryClient } from "@tanstack/react-query"

const SortButtons = () => {
    const Arrow = ({
        rotate = false,
        active = false,
    }: {
        rotate?: boolean
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

    type Param = "likes" | "hates" | "createdAt" | undefined
    type Order = "asc" | "desc" | undefined

    const router = useRouter()
    const queryClient = useQueryClient()
    const [param, setParam] = React.useState<Param>(undefined)
    const [order, setOrder] = React.useState<Order>(undefined)

    React.useEffect(() => {
        if (param && order) {
            router.replace({ query: { ...router.query, param, order } })
        }
    }, [param, order, router])

    React.useEffect(() => {
        setParam(router.query.param as unknown as Param)
        setOrder(router.query.order as unknown as Order)
        queryClient.invalidateQueries(["movies"])
    }, [router.query, queryClient])

    const onClick = (p: Param) => {
        if (param === p) {
            order === "asc" ? setOrder("desc") : setOrder("asc")
            return
        }
        setParam(p)
        setOrder("asc")
    }

    return (
        <div>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-8">
                <Button
                    onClick={() => onClick("likes")}
                    //@ts-ignore
                    active={param === "likes" ? 1 : 0}
                >
                    <>
                        Likes
                        <Arrow
                            //@ts-ignore
                            active={param === "likes" ? 1 : 0}
                            rotate={order === "desc"}
                        />
                    </>
                </Button>
                <Button
                    onClick={() => onClick("hates")}
                    //@ts-ignore
                    active={param === "hates" ? 1 : 0}
                >
                    <>
                        Hates
                        <Arrow
                            //@ts-ignore
                            active={param === "hates" ? 1 : 0}
                            rotate={order === "desc"}
                        />
                    </>
                </Button>
                <Button
                    onClick={() => onClick("createdAt")}
                    //@ts-ignore
                    active={param === "createdAt" ? 1 : 0}
                >
                    <>
                        Created at
                        <Arrow
                            //@ts-ignore
                            active={param === "createdAt" ? 1 : 0}
                            rotate={order === "desc"}
                        />
                    </>
                </Button>
            </div>
        </div>
    )
}

export default SortButtons
