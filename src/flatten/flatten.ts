type FlattenableObject = Record<string, unknown>

/**
 * TODO: See if we can re-use the DynamoDB types instead of re-creating our own
 */
type ScalarType = string | number | null

interface DocumentType {
  [x: string]: ScalarType | Array<ScalarType | DocumentType> | DocumentType
}

/**
 * Rejects objects whose terminal types won't be preserved, such as custom classes
 */
export function typeSafeFlattenObject(object: DocumentType): FlattenableObject {
  return flattenObject(object)
}

export function flattenObject(object: FlattenableObject): FlattenableObject {
  return flattenObjectRecursively(object, undefined, {})
}

export function flattenObjectRecursively(
  object: FlattenableObject,
  prefix: string | undefined = undefined,
  result: FlattenableObject,
): FlattenableObject {
  // Preserve empty objects and arrays, they are lost otherwise
  if (prefix && isEmpty(object)) {
    result[prefix] = Array.isArray(object) ? [] : {}
    return result
  }

  prefix = prefix ? prefix + '.' : ''

  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      const subObject = object[key]

      if (isRecursivelyFlattenableObject(subObject)) {
        flattenObjectRecursively(subObject, prefix + key, result)
      } else {
        result[prefix + key] = subObject
      }
    }
  }

  return result
}

function isEmpty(object: unknown): boolean {
  if (
    typeof object === 'object' &&
    object !== null &&
    Object.keys(object).length === 0
  ) {
    return true
  }
  return false
}

/**
 * Drops custom classes like Dates, etc
 */
function isRecursivelyFlattenableObject(
  object: unknown,
): object is FlattenableObject {
  if (
    typeof object === 'object' &&
    (Array.isArray(object) ||
      Object.prototype.toString.call(object) === '[object Object]') &&
    object !== null
  ) {
    return true
  }
  return false
}
