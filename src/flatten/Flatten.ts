import { AnyType } from '../obj'
import { Obj } from '../obj/Obj'
import { FlattenableObject, FlattenedObject } from './types'

export class Flatten {
  static safeFlatten(object: FlattenableObject): FlattenedObject {
    return Flatten.flatten(object)
  }

  static flatten(object: AnyType): FlattenedObject {
    return Flatten.flattenRecursively(object, '', {})
  }

  private static flattenRecursively(
    object: unknown,
    prefix = '',
    result: FlattenedObject,
  ): FlattenedObject {
    // Preserve empty objects
    if (prefix && Obj.isTerminalType(object)) {
      result[prefix] = object
      return result
    }

    prefix = prefix ? prefix + '.' : ''

    if (Obj.isListType(object)) {
      for (let key = 0; key < object.length; key++) {
        Flatten.flattenRecursively(object[key], prefix + key, result)
      }
    }

    if (Obj.isMapType(object)) {
      for (const key in object) {
        if (Object.prototype.hasOwnProperty.call(object, key)) {
          Flatten.flattenRecursively(object[key], prefix + key, result)
        }
      }
    }

    return result
  }
}
