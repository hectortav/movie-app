import React from "react"
import Header from "./Header"

interface LayoutProps
    extends React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
    > {}

const Layout: React.FC<LayoutProps> = (props) => {
    const { children } = props
    return (
        <div className="mx-8">
            <Header />
            {children}
        </div>
    )
}

export default Layout
