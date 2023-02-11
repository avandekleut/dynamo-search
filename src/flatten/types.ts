export interface TypesafeFlattenableObject {
  [attributeName: string]:
    | ScalarType
    | Array<ScalarType | TypesafeFlattenableObject>
    | TypesafeFlattenableObject
}

export interface FlattenedObject {
  [attributeName: string]: ScalarType
}

const emptyObject = {} as const
type EmptyObject = typeof emptyObject

const emptyArray = [] as const
type EmptyArray = typeof emptyArray

export type EmptyType = EmptyArray | EmptyObject

/**
 * TODO: See if we can re-use the DynamoDB types instead of re-creating our own
 */
export type ScalarType =
  | string
  | number
  | boolean
  | null
  | EmptyObject
  | EmptyArray

export type UnsafeFlattenableObject = Record<string, unknown>
