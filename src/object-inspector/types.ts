export interface FlattenableObject {
  [attributeName: string]:
    | TerminalType
    | Array<TerminalType | FlattenableObject>
    | FlattenableObject
}

export interface FlattenedObject {
  [attributeName: string]: TerminalType
}

const emptyObject = {} as const
type EmptyObject = typeof emptyObject

const emptyArray = [] as const
type EmptyArray = typeof emptyArray

export type EmptyType = EmptyArray | EmptyObject

export type ScalarType = string | number | boolean | null

export type TerminalType = ScalarType | EmptyType

export type UnsafeFlattenableObject = Record<string, unknown>
