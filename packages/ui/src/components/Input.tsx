import React from "react"
import type { UseFormRegister } from "react-hook-form"

interface InputProps
    extends React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
    > {
    errors: string | undefined
    register: UseFormRegister<any>
    name: string
    title: string
    placeholder: string
    type: string
    multiline?: boolean
}

const Input: React.FC<InputProps> = ({
    errors,
    register,
    name,
    title,
    placeholder,
    type,
    multiline = false,
}) => {
    const InputType = `${multiline ? "textarea" : "input"}`
    return (
        <div className="-mx-3 mb-6 flex flex-wrap">
            <div className="w-full px-3">
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700">
                    {title}
                </label>
                <InputType
                    // @ts-ignore
                    className={`mb-3 block w-full appearance-none rounded border ${
                        errors ? "border-red-500" : "border-gray-200"
                    } bg-gray-200 py-3 px-4 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none`}
                    type={type}
                    placeholder={placeholder}
                    {...register(name)}
                />
                <p className="text-xs italic text-red-500">{errors}</p>
            </div>
        </div>
    )
}

export default Input
