import {
  FlattenableObject,
  FlattenedObject,
  UnsafeFlattenableObject,
} from '../object-inspector'
import { ObjectInspector } from '../object-inspector/ObjectInspector'

export class Flatten {
  static safeFlatten(object: FlattenableObject): FlattenedObject {
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
    if (prefix && ObjectInspector.isTerminalType(object)) {
      result[prefix] = object
      return result
    }

    prefix = prefix ? prefix + '.' : ''

    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        const subObject = object[key]

        if (ObjectInspector.isRecursivelyFlattenableObject(subObject)) {
          Flatten.flattenRecursively(subObject, prefix + key, result)
        } else if (ObjectInspector.isTerminalType(subObject)) {
          result[prefix + key] = subObject
        }
      }
    }

    return result
  }
}
