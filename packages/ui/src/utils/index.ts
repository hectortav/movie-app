/* https://johnresig.com/blog/javascript-pretty-date/ */
export const toSocialMediaDate = (datestamp: string) => {
    const date = new Date(datestamp)
    const diff = (new Date().getTime() - date.getTime()) / 1000
    const days = Math.floor(diff / (60 * 60 * 24))

    if (isNaN(days) || days < 0 || days >= 31) return
    return (
        (days == 0 &&
            ((diff < 60 && "just now") ||
                (diff < 60 * 2 && "1 minute ago") ||
                (diff < 60 * 60 && `${Math.floor(diff / 60)} minutes ago`) ||
                (diff < 60 * 60 * 2 && "1 hour ago") ||
                (diff < 60 * 60 * 24 &&
                    `${Math.floor(diff / (60 * 60))} hours ago`))) ||
        (days == 1 && "Yesterday") ||
        (days < 7 && `${days} days ago`) ||
        (days < 31 && `${Math.ceil(days / 7)} weeks ago`)
    )
}
