import {
  EmptyType,
  FlattenableObject,
  GenericObject,
  ScalarType,
  TerminalType,
} from './types'

export class ObjectInspector {
  static isRecursivelyFlattenableObject(
    object: unknown,
  ): object is FlattenableObject {
    if (typeof object === 'object' && !ObjectInspector.isEmpty(object)) {
      return true
    }
    return false
  }

  static isTerminalType(object: unknown): object is TerminalType {
    if (
      ObjectInspector.isScalarType(object) ||
      ObjectInspector.isEmpty(object)
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
      typeof object === 'boolean'
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

  static isGenericObject(object: unknown): object is GenericObject {
    if (
      typeof object === 'object' &&
      !Array.isArray(object) &&
      object !== null
    ) {
      return true
    }
    return false
  }
}
