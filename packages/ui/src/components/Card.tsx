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
    } = props

    return (
        <div className={className} style={style}>
            <div className="px-6 py-4">
                <div className="mb-2 text-xl font-bold">{title}</div>
                <div className="text-l my-2">
                    Posted by{" "}
                    <a
                        href={`?userId=${creatorId}`}
                        className="text-sky-500 no-underline hover:underline"
                    >
                        {`${firstname} ${lastname}`}
                    </a>{" "}
                    {toSocialMediaDate(createdAt)}
                </div>
                <p className="text-base text-gray-700">{description} </p>
                <div className="text-l my-2">
                    {likes} likes | {hates} hates
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
