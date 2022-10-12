import React from "react"
import { toSocialMediaDate } from "../utils"

interface CardProps
    extends React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
    > {
    title: string
    description: string
    creatorId: string
    firstname: string
    lastname: string
    likes: number
    hates: number
    createdAt: string
    onLike: () => void
    onHate: () => void
    isMine: boolean
    myVote: "LIKES" | "HATES" | null
}

const Card: React.FC<CardProps> = (props) => {
    const {
        className,
        style,
        title,
        description,
        creatorId,
        firstname,
        lastname,
        likes,
        hates,
        createdAt,
        onLike,
        onHate,
        isMine,
        myVote,
    } = props
    console.log({ myVote, isMine })
    return (
        <div className={className} style={style}>
            <div
                className={`px-6 py-4 ${isMine && "border-2 border-blue-300"}`}
            >
                <div className="mb-2 text-xl font-bold">{title}</div>
                <div className="text-l my-2 md:flex">
                    <div>
                        Posted by{" "}
                        <a
                            href={`?userId=${creatorId}`}
                            className="text-sky-500 no-underline hover:underline"
                        >
                            {`${firstname} ${lastname}`}
                        </a>
                    </div>
                    <div className="ml-auto text-right">
                        {toSocialMediaDate(createdAt)}
                    </div>
                </div>
                <p className="text-base text-gray-700">{description} </p>
                <div className="text-l my-2 flex items-center justify-center font-mono">
                    {!isMine && (
                        <button onClick={() => onLike()}>
                            <span
                                className={`text-3xl ${
                                    myVote !== "LIKES" && "grayscale"
                                }`}
                            >
                                😍
                            </span>
                        </button>
                    )}
                    <div className="mx-2">
                        {likes} likes | {hates} hates
                    </div>
                    {!isMine && (
                        <button onClick={() => onHate()}>
                            <span
                                className={`text-3xl ${
                                    myVote !== "HATES" && "grayscale"
                                }`}
                            >
                                😡
                            </span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Card

Card.defaultProps = {
    style: {},
    className:
        "max-w-xl overflow-hidden rounded border text-gray-700 shadow-lg",
}
