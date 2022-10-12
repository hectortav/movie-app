export const containsField = (array: any[], field: string): boolean =>
    array.findIndex((obj) => obj.field === field) > -1
