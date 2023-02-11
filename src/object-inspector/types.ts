export interface FlattenableObject {
  [attributeName: string]:
    | TerminalType
    | Array<TerminalType | FlattenableObject>
    | FlattenableObject
}

export interface FlattenedObject {
  [attributeName: string]: TerminalType
}

export type DocumentType = Array<unknown> | GenericObject

export type TerminalType = ScalarType | EmptyType

export type EmptyType = EmptyArray | EmptyObject

const emptyObject = {} as const
type EmptyObject = typeof emptyObject

const emptyArray = [] as const
type EmptyArray = typeof emptyArray

export type ScalarType = string | number | boolean | null

export type GenericObject = Record<string, unknown>

export type ValueOf<T> = T[keyof T]
