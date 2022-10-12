import React from "react"

interface ButtonProps
    extends React.DetailedHTMLProps<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
    > {
    activee: boolean
}

const Button: React.FC<ButtonProps> = (props) => {
    let { children, style, className, active } = props
    className = "rounded py-2 px-4 font-bold flex items-center justify-center"

    if (active) {
        className += " bg-blue-500 text-white hover:bg-blue-700"
    } else {
        className += " bg-gray-200 text-blue-500 hover:bg-gray-700"
    }
    return (
        <button className={className} style={style} {...props}>
            {children}
        </button>
    )
}

export default Button

Button.defaultProps = {
    active: true,
    style: {},
}
