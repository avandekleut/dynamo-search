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

export class ObjectInspector {
  static isRecursivelyFlattenableObject(
    object: unknown,
  ): object is FlattenableObject {
    if (
      ObjectInspector.isListType(object) ||
      ObjectInspector.isMapType(object)
    ) {
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
      ObjectInspector.isEmptyArray(object) ||
      ObjectInspector.isEmptyObject(object)
    ) {
      return true
    }
    return false
  }

  static isEmptyArray(object: unknown): object is EmptyArray {
    if (
      ObjectInspector.isListType(object) &&
      Object.keys(object).length === 0
    ) {
      return true
    }
    return false
  }

  static isEmptyObject(object: unknown): object is EmptyObject {
    if (ObjectInspector.isMapType(object) && Object.keys(object).length === 0) {
      return true
    }
    return false
  }

  static isDocumentType(object: unknown): object is DocumentType {
    if (
      (ObjectInspector.isListType(object) ||
        ObjectInspector.isMapType(object)) &&
      !ObjectInspector.isEmpty(object)
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
}
