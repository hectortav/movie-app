export interface ModelError {
    field: string
    message: string
}

export interface ModelResponseType<T> {
    data: T | null
    errors: ModelError[]
}
