import { useQuery } from "@tanstack/react-query"
import axios from "axios"

const fetchMe = async () => {
    const { data } = await axios.get("http://localhost:8080/user/me", {
        withCredentials: true,
    })
    return data
}

const Header = () => {
    const { data, isLoading } = useQuery(["me"], () => fetchMe())
    if (isLoading) {
        return <div>Loading...</div>
    }
    return (
        <nav className="flex h-[4rem] w-full items-center">
            <h1 className="mr-auto text-2xl no-underline hover:underline">
                <a href="/">MovieRama</a>
            </h1>
            <div className="ml-auto text-lg">
                <div className="hidden no-underline hover:underline md:flex">
                    <a
                        href={`?userId=${data?.data?.id}`}
                    >{`${data?.data.firstname} ${data?.data.lastname}`}</a>
                </div>
            </div>
        </nav>
    )
}

export default Header
