import * as fc from 'fast-check'

import { Obj } from '../obj'
import { InferConfig, InferNumberConfig, InferStringConfig } from './types'

export class PropertyGenerator {
  static infer<T>(obj: T, config?: InferConfig): fc.Arbitrary<T> {
    const inferredArbitraries: Array<fc.Arbitrary<unknown>> = []

    if (PropertyGenerator.isBoolean(obj)) {
      inferredArbitraries.push(fc.boolean())
    }

    if (PropertyGenerator.isNumber(obj)) {
      inferredArbitraries.push(PropertyGenerator.inferNumber(obj, config))
    }

    if (PropertyGenerator.isString(obj)) {
      inferredArbitraries.push(PropertyGenerator.inferString(obj, config))
    }

    return fc.oneof(...inferredArbitraries) as fc.Arbitrary<T>
  }

  static inferString<T extends string>(
    obj: T,
    config?: InferStringConfig,
  ): fc.Arbitrary<T> {
    const inferredArbitraries: Array<fc.Arbitrary<unknown>> = []

    const includeLessSpecificStringTypes = !config?.inferMostSpecificStringType

    if (PropertyGenerator.isHexString(obj)) {
      inferredArbitraries.push(fc.hexaString())
    }

    if (
      PropertyGenerator.isBase64String(obj) &&
      includeLessSpecificStringTypes
    ) {
      inferredArbitraries.push(fc.base64String())
    }

    if (
      PropertyGenerator.isAsciiString(obj) &&
      includeLessSpecificStringTypes
    ) {
      inferredArbitraries.push(fc.asciiString())
    }

    if (
      PropertyGenerator.isUnicodeString(obj) &&
      includeLessSpecificStringTypes
    ) {
      inferredArbitraries.push(fc.unicodeString())
    }

    if (PropertyGenerator.isString(obj) && includeLessSpecificStringTypes) {
      inferredArbitraries.push(fc.string())
    }

    return fc.oneof(...inferredArbitraries) as fc.Arbitrary<T>
  }

  static isUnicodeString(obj: unknown): obj is string {
    return PropertyGenerator.validateRegex(obj, /^[\u0032-\u007F]+/)
  }

  static isAsciiString(obj: unknown): obj is string {
    return PropertyGenerator.validateRegex(obj, /[ -~]/)
  }

  static isBase64String(obj: unknown): obj is string {
    return PropertyGenerator.validateRegex(
      obj,
      /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/,
    )
  }

  static isHexString(obj: unknown): obj is string {
    return PropertyGenerator.validateRegex(obj, /^[a-fA-F0-9]+$/)
  }

  private static validateRegex(obj: unknown, regex: RegExp): obj is string {
    if (PropertyGenerator.isString(obj)) {
      return regex.exec(obj) !== null
    }
    return false
  }

  static isString(obj: unknown): obj is string {
    return typeof obj === 'string'
  }

  static inferNumber<T extends number>(
    obj: T,
    config?: InferNumberConfig,
  ): fc.Arbitrary<T> {
    const inferredArbitraries: Array<fc.Arbitrary<unknown>> = []

    if (PropertyGenerator.isInteger(obj)) {
      inferredArbitraries.push(fc.integer())
    }

    if (PropertyGenerator.isNat(obj)) {
      inferredArbitraries.push(fc.nat())
    }

    if (PropertyGenerator.isFloat(obj)) {
      inferredArbitraries.push(fc.float(), fc.double())
    }

    if (PropertyGenerator.isBigInt(obj)) {
      inferredArbitraries.push(fc.bigInt(), fc.bigUint())
    }

    return fc.oneof(...inferredArbitraries) as fc.Arbitrary<T>
  }

  static isBigInt(obj: unknown): obj is bigint {
    return typeof obj === 'bigint'
  }

  static isFloat(obj: unknown): obj is number {
    return Number(obj) === obj && obj % 1 !== 0
  }

  static isNat(obj: unknown): obj is number {
    return PropertyGenerator.isInteger(obj) && obj >= 0
  }

  static isInteger(obj: unknown): obj is number {
    return Number.isSafeInteger(obj)
  }

  static isNumber(obj: unknown): obj is number {
    return Number(obj) === obj
  }

  static isBoolean(obj: unknown): obj is boolean {
    return typeof obj === 'boolean'
  }

  static generateArbitraryFromObject<T>(object: T): fc.Arbitrary<T> {
    if (Obj.isString(object)) {
      return fc.string() as fc.Arbitrary<T>
    } else if (Obj.isNumber(object)) {
      return fc.oneof(fc.double(), fc.integer()) as fc.Arbitrary<T>
    } else if (Obj.isBoolean(object)) {
      return fc.boolean() as fc.Arbitrary<T>
    } else if (Obj.isNull(object)) {
      return fc.constant(null) as fc.Arbitrary<T>
    } else if (Obj.isListType(object)) {
      return fc.array(
        fc.oneof(
          ...object.map((item) =>
            PropertyGenerator.generateArbitraryFromObject(item),
          ),
        ),
      ) as fc.Arbitrary<T>
    } else if (Obj.isMapType(object)) {
      const result: Record<string, fc.Arbitrary<unknown>> = {}
      Object.keys(object).forEach(function (key, index) {
        result[key] = PropertyGenerator.generateArbitraryFromObject(object[key])
      })
      return fc.record(result) as fc.Arbitrary<T>
    } else {
      throw new Error(
        'Unable to generate properties for object:' +
          '\n' +
          JSON.stringify(object, undefined, 2),
      )
    }
  }
}
