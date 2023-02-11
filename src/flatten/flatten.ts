import { AnyType } from '../object-inspector'
import { ObjectInspector } from '../object-inspector/ObjectInspector'
import { FlattenableObject, FlattenedObject } from './types'

export class Flatten {
  static safeFlatten(object: FlattenableObject): FlattenedObject {
    return Flatten.flatten(object)
  }

  static flatten(object: AnyType): FlattenedObject {
    return Flatten.flattenRecursively(object, '', {})
  }

  private static flattenRecursively(
    object: AnyType,
    prefix = '',
    result: FlattenedObject,
  ): FlattenedObject {
    if (prefix && ObjectInspector.isTerminalType(object)) {
      console.log(`Found terminal object: ${JSON.stringify(object)}`)
      result[prefix] = object
      return result
    }

    prefix = prefix ? prefix + '.' : ''

    if (ObjectInspector.isListType(object)) {
      for (let key = 0; key < object.length; key++) {
        if (Object.prototype.hasOwnProperty.call(object, key)) {
          const subObject = object[key]

          if (ObjectInspector.isRecursivelyFlattenableObject(subObject)) {
            Flatten.flattenRecursively(subObject, prefix + key, result)
          } else if (ObjectInspector.isTerminalType(subObject)) {
            result[prefix + key] = subObject
          }
        }
      }
    }

    if (ObjectInspector.isMapType(object)) {
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
    }

    return result
  }
}
