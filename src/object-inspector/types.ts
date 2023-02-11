export type AnyType = DocumentType | TerminalType

export type DocumentType = ListType | MapType

export type MapType = Record<string, unknown>

export type ListType = Array<unknown>

export type TerminalType = ScalarType | EmptyType

export type EmptyType = EmptyArray | EmptyObject

const emptyObject = {} as const
export type EmptyObject = typeof emptyObject

const emptyArray = [] as const
export type EmptyArray = typeof emptyArray

export type ScalarType = string | number | boolean | null

export type ValueOf<T> = T[keyof T]
