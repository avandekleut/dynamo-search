import {
  EmptyType,
  FlattenedObject,
  ScalarType,
  TypesafeFlattenableObject,
  UnsafeFlattenableObject,
} from './types'

export class Flatten {
  static safeFlatten(object: TypesafeFlattenableObject): FlattenedObject {
    return Flatten.flatten(object)
  }

  static flatten(object: UnsafeFlattenableObject): FlattenedObject {
    return Flatten.flattenRecursively(object, undefined, {})
  }

  private static flattenRecursively(
    object: UnsafeFlattenableObject,
    prefix: string | undefined = undefined,
    result: FlattenedObject,
  ): FlattenedObject {
    // Preserve empty objects and arrays, they are lost otherwise
    if (prefix && Flatten.isEmpty(object)) {
      result[prefix] = Array.isArray(object) ? [] : {}
      return result
    }

    prefix = prefix ? prefix + '.' : ''

    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        const subObject = object[key]

        if (Flatten.isRecursivelyFlattenableObject(subObject)) {
          Flatten.flattenRecursively(subObject, prefix + key, result)
        } else if (Flatten.isScalarType(subObject)) {
          result[prefix + key] = subObject
        }
      }
    }

    return result
  }

  /**
   * // TODO: Parse and fix this comment...
   * Drops custom classes like Dates, etc
   */
  static isRecursivelyFlattenableObject(
    object: unknown,
  ): object is TypesafeFlattenableObject {
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

  static isScalarType(object: unknown): object is ScalarType {
    if (
      typeof object === 'string' ||
      typeof object === 'number' ||
      typeof object === 'bigint' ||
      typeof object === 'boolean' ||
      Flatten.isEmpty(object)
    ) {
      return true
    }
    return false
  }

  static isEmpty(object: unknown): object is EmptyType {
    if (
      typeof object === 'object' &&
      object !== null &&
      Object.keys(object).length === 0
    ) {
      return true
    }
    return false
  }
}
