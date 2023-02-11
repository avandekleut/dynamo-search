import * as EmailValidator from 'email-validator'
import * as fc from 'fast-check'

import { Obj } from '../obj'
import {
  BooleanCompareFunc,
  GeneratorFunc,
  GenericFunction,
  InferConfig,
  InferNumberConfig,
  InferStringConfig,
  NumericCompareFunc,
} from './types'

export class PropertyGenerator {
  // TODO: Ensure all inferred arbitraries have length at least 1

  static infer<T>(obj: T, config?: InferConfig): fc.Arbitrary<T> {
    const inferredArbitraries: Array<fc.Arbitrary<unknown>> = []

    if (PropertyGenerator.isBoolean(obj)) {
      inferredArbitraries.push(fc.boolean())
    }

    if (PropertyGenerator.isBigInt(obj)) {
      inferredArbitraries.push(fc.bigInt(), fc.bigUint())
    }

    if (PropertyGenerator.isDate(obj)) {
      inferredArbitraries.push(fc.date())
    }

    if (PropertyGenerator.isNull(obj) || PropertyGenerator.isUndefined(obj)) {
      inferredArbitraries.push(fc.constant(obj))
    }

    if (PropertyGenerator.isNumber(obj)) {
      inferredArbitraries.push(PropertyGenerator.inferNumber(obj, config))
    }

    if (PropertyGenerator.isString(obj)) {
      inferredArbitraries.push(PropertyGenerator.inferString(obj, config))
    }

    return fc.oneof(...inferredArbitraries) as fc.Arbitrary<T>
  }

  static inferFunc<T>(
    obj: GenericFunction,
  ): fc.Arbitrary<GeneratorFunc<T>> | undefined {
    try {
      const result = obj()
      const inferredResultArbitrary = PropertyGenerator.infer(result)
      return fc.func(inferredResultArbitrary) as fc.Arbitrary<GeneratorFunc<T>>
    } catch (err) {
      return undefined
    }
  }

  static isCompareFunc(obj: GenericFunction): obj is NumericCompareFunc {
    try {
      return PropertyGenerator.isNumber(obj(0, 1))
    } catch (err) {
      return false
    }
  }

  static isBooleanCompareFunc(obj: GenericFunction): obj is BooleanCompareFunc {
    try {
      return PropertyGenerator.isBoolean(obj(0, 1))
    } catch (err) {
      return false
    }
  }

  static isFunction(obj: unknown): obj is GenericFunction {
    return typeof obj === 'function'
  }

  static isUndefined(obj: unknown): obj is undefined {
    return obj === undefined
  }

  static isNull(obj: unknown): obj is null {
    return obj === null
  }

  static isDate(obj: unknown): obj is Date {
    return obj instanceof Date
  }

  static inferString(
    obj: string,
    config?: InferStringConfig,
  ): fc.Arbitrary<string> {
    const inferredArbitraries: Array<fc.Arbitrary<string>> = []

    const includeLessSpecificStringTypes = !config?.inferMostSpecificStringType

    if (PropertyGenerator.isHexString(obj) && includeLessSpecificStringTypes) {
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

    return fc.oneof(...inferredArbitraries)
  }

  static isEmail(obj: string): boolean {
    return EmailValidator.validate(obj)
  }

  static isDomain(obj: string): boolean {
    return PropertyGenerator.validateRegex(
      obj,
      /^(?!.{256})(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(?:[a-z]{1,63}|xn--[a-z0-9]{1,59})$/,
    )
  }

  static isUuid(obj: string): boolean {
    return PropertyGenerator.validateRegex(
      obj,
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    )
  }

  static isIpV6(obj: string): boolean {
    return PropertyGenerator.validateRegex(
      obj,
      /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/,
    )
  }

  static isIpV4(obj: string): boolean {
    return PropertyGenerator.validateRegex(
      obj,
      /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/,
    )
  }

  static isJson(obj: string): boolean {
    try {
      JSON.parse(obj)
      return true
    } catch (err) {
      return false
    }
  }

  static isHexString(obj: string): boolean {
    return PropertyGenerator.validateRegex(obj, /^[a-fA-F0-9]+$/)
  }

  static isBase64String(obj: string): boolean {
    return PropertyGenerator.validateRegex(
      obj,
      /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/,
    )
  }

  static isAsciiString(obj: string): boolean {
    return PropertyGenerator.validateRegex(obj, /[ -~]/)
  }

  static isUnicodeString(obj: string): boolean {
    return PropertyGenerator.validateRegex(obj, /^[\u0032-\u007F]+/)
  }

  private static validateRegex(obj: string, regex: RegExp): boolean {
    return regex.exec(obj) !== null
  }

  static isString(obj: unknown): obj is string {
    return typeof obj === 'string'
  }

  static inferNumber(
    obj: number,
    config?: InferNumberConfig,
  ): fc.Arbitrary<number> {
    const inferredArbitraries: Array<fc.Arbitrary<number>> = []

    if (PropertyGenerator.isInteger(obj)) {
      inferredArbitraries.push(fc.integer())
    }

    if (PropertyGenerator.isNat(obj)) {
      inferredArbitraries.push(fc.nat())
    }

    if (PropertyGenerator.isFloat(obj)) {
      inferredArbitraries.push(fc.float(), fc.double())
    }

    return fc.oneof(...inferredArbitraries)
  }

  static isBigInt(obj: unknown): obj is bigint {
    return typeof obj === 'bigint'
  }

  static isFloat(obj: number): boolean {
    return Number(obj) === obj && obj % 1 !== 0
  }

  static isNat(obj: number): boolean {
    return PropertyGenerator.isInteger(obj) && obj >= 0
  }

  static isInteger(obj: number): boolean {
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
