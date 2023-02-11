import { FlattenableObject } from '../flatten'
import {
  DocumentType,
  EmptyArray,
  EmptyObject,
  EmptyType,
  ListType,
  MapType,
  ScalarType,
  TerminalType,
} from './types'

export class Obj {
  static isRecursivelyFlattenableObject(
    object: unknown,
  ): object is FlattenableObject {
    if (Obj.isListType(object) || Obj.isMapType(object)) {
      return true
    }
    return false
  }

  static isEmpty(object: unknown): object is EmptyType {
    if (Obj.isEmptyArray(object) || Obj.isEmptyObject(object)) {
      return true
    }
    return false
  }

  static isEmptyArray(object: unknown): object is EmptyArray {
    if (Obj.isListType(object) && Object.keys(object).length === 0) {
      return true
    }
    return false
  }

  static isEmptyObject(object: unknown): object is EmptyObject {
    if (Obj.isMapType(object) && Object.keys(object).length === 0) {
      return true
    }
    return false
  }

  static isDocumentType(object: unknown): object is DocumentType {
    if (
      (Obj.isListType(object) || Obj.isMapType(object)) &&
      !Obj.isEmpty(object)
    ) {
      return true
    }
    return false
  }

  static isMapType(object: unknown): object is MapType {
    if (
      typeof object === 'object' &&
      !Array.isArray(object) &&
      object !== null
    ) {
      return true
    }
    return false
  }

  static isListType(object: unknown): object is ListType {
    if (
      typeof object === 'object' &&
      Array.isArray(object) &&
      object !== null
    ) {
      return true
    }
    return false
  }

  static isTerminalType(object: unknown): object is TerminalType {
    if (Obj.isScalarType(object) || Obj.isEmpty(object)) {
      return true
    }
    return false
  }

  static isScalarType(object: unknown): object is ScalarType {
    if (
      Obj.isString(object) ||
      Obj.isNumber(object) ||
      Obj.isBoolean(object) ||
      Obj.isNull(object)
    ) {
      return true
    }
    return false
  }

  static isString(object: unknown): object is string {
    if (typeof object === 'string') {
      return true
    }
    return false
  }

  static isNumber(object: unknown): object is number {
    if (typeof object === 'number' || typeof object === 'bigint') {
      return true
    }
    return false
  }

  static isBoolean(object: unknown): object is boolean {
    if (typeof object === 'boolean') {
      return true
    }
    return false
  }

  static isNull(object: unknown): object is null {
    if (object === null) {
      return true
    }
    return false
  }
}
