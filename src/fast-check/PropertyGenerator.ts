import * as EmailValidator from 'email-validator'
import * as fc from 'fast-check'
import { debugFactory } from '../logger/debug'

import {
  BooleanCompareFunction,
  GeneratorFunction,
  GenericFunction,
  InferConfig,
  InferNumberConfig,
  InferStringConfig,
  NumericCompareFunction,
} from './types'

const debug = debugFactory()

export class PropertyGenerator {
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
      const inferredNumberArbitrary = PropertyGenerator.inferNumber(obj, config)
      if (inferredNumberArbitrary) {
        inferredArbitraries.push(inferredNumberArbitrary)
      }
    }

    if (PropertyGenerator.isString(obj)) {
      const inferredStringArbitrary = PropertyGenerator.inferString(obj, config)
      if (inferredStringArbitrary) {
        inferredArbitraries.push(inferredStringArbitrary)
      }
    }

    if (PropertyGenerator.isFunction(obj)) {
      const inferredFunctionArbitrary = PropertyGenerator.inferFunction(obj)
      if (inferredFunctionArbitrary) {
        inferredArbitraries.push(inferredFunctionArbitrary)
      }
    }

    if (PropertyGenerator.isArray(obj)) {
      const inferredArbitrary = fc.array(
        fc.oneof(...obj.map((item) => PropertyGenerator.infer(item))),
      )
      inferredArbitraries.push(inferredArbitrary)
    }

    if (PropertyGenerator.isRecord(obj)) {
      const result: Record<string, fc.Arbitrary<unknown>> = {}
      Object.keys(obj).forEach(function (key, index) {
        result[key] = PropertyGenerator.infer(obj[key])
      })
      return fc.record(result) as fc.Arbitrary<T>
    }

    const minimumArbitrary = PropertyGenerator.getMinimumArbitrary(
      inferredArbitraries,
    ) as fc.Arbitrary<T> | undefined

    if (minimumArbitrary === undefined) {
      throw new Error(`Could not infer ${obj}`)
    }

    return minimumArbitrary
  }

  static inferFunction(
    obj: GenericFunction,
  ): fc.Arbitrary<GenericFunction> | undefined {
    const inferredArbitraries: Array<fc.Arbitrary<GenericFunction>> = []

    if (PropertyGenerator.isBooleanCompareFunction(obj)) {
      inferredArbitraries.push(fc.compareBooleanFunc())
    }

    if (PropertyGenerator.isNumericCompareFunction(obj)) {
      inferredArbitraries.push(fc.compareFunc())
    }

    if (PropertyGenerator.isGeneratorFunction(obj)) {
      const inferredFunctionArbitrary =
        PropertyGenerator.inferGeneratorFunc(obj)
      if (inferredFunctionArbitrary) {
        inferredArbitraries.push(inferredFunctionArbitrary)
      }
    }

    return PropertyGenerator.getMinimumArbitrary(inferredArbitraries)
  }

  static inferGeneratorFunc<T>(
    obj: GeneratorFunction<T>,
  ): fc.Arbitrary<GeneratorFunction<T>> | undefined {
    const result = obj()
    const inferredResultArbitrary = PropertyGenerator.infer(result)
    return fc.func(inferredResultArbitrary) as fc.Arbitrary<
      GeneratorFunction<T>
    >
  }

  @debug
  static isGeneratorFunction<T>(
    obj: GenericFunction,
  ): obj is GeneratorFunction<T> {
    try {
      obj()
      return true
    } catch (err) {
      return false
    }
  }

  @debug
  static isNumericCompareFunction(
    obj: GenericFunction,
  ): obj is NumericCompareFunction {
    try {
      return PropertyGenerator.isNumber(obj(0, 1))
    } catch (err) {
      return false
    }
  }

  @debug
  static isBooleanCompareFunction(
    obj: GenericFunction,
  ): obj is BooleanCompareFunction {
    try {
      return PropertyGenerator.isBoolean(obj(0, 1))
    } catch (err) {
      return false
    }
  }

  @debug
  static isFunction(obj: unknown): obj is GenericFunction {
    return typeof obj === 'function'
  }

  @debug
  static isUndefined(obj: unknown): obj is undefined {
    return obj === undefined
  }

  @debug
  static isNull(obj: unknown): obj is null {
    return obj === null
  }

  @debug
  static isDate(obj: unknown): obj is Date {
    return obj instanceof Date
  }

  static inferString(
    obj: string,
    config?: InferStringConfig,
  ): fc.Arbitrary<string> | undefined {
    const inferredArbitraries: Array<fc.Arbitrary<string>> = []

    const returnAll = !config?.inferMostSpecificStringType

    if (PropertyGenerator.isEmailAddress(obj) && returnAll) {
      inferredArbitraries.push(fc.emailAddress())
    }

    if (PropertyGenerator.isDomain(obj) && returnAll) {
      inferredArbitraries.push(fc.domain())
    }

    if (PropertyGenerator.isUuid(obj) && returnAll) {
      inferredArbitraries.push(fc.uuid())
    }

    if (PropertyGenerator.isIpV6(obj) && returnAll) {
      inferredArbitraries.push(fc.ipV6())
    }

    if (PropertyGenerator.isIpV4(obj) && returnAll) {
      inferredArbitraries.push(fc.ipV4())
    }

    if (PropertyGenerator.isJson(obj) && returnAll) {
      inferredArbitraries.push(fc.json())
    }

    if (PropertyGenerator.isHexString(obj) && returnAll) {
      inferredArbitraries.push(fc.hexaString())
    }

    if (PropertyGenerator.isBase64String(obj) && returnAll) {
      inferredArbitraries.push(fc.base64String())
    }

    if (PropertyGenerator.isAsciiString(obj) && returnAll) {
      inferredArbitraries.push(fc.asciiString())
    }

    if (PropertyGenerator.isUnicodeString(obj) && returnAll) {
      inferredArbitraries.push(fc.unicodeString())
    }

    if (PropertyGenerator.isString(obj) && returnAll) {
      inferredArbitraries.push(fc.string())
    }

    return PropertyGenerator.getMinimumArbitrary(inferredArbitraries)
  }

  @debug
  static isEmailAddress(obj: string): boolean {
    return EmailValidator.validate(obj)
  }

  @debug
  static isDomain(obj: string): boolean {
    return PropertyGenerator.validateRegex(
      obj,
      /^(?!.{256})(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(?:[a-z]{1,63}|xn--[a-z0-9]{1,59})$/,
    )
  }

  @debug
  static isUuid(obj: string): boolean {
    return PropertyGenerator.validateRegex(
      obj,
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    )
  }

  @debug
  static isIpV6(obj: string): boolean {
    return PropertyGenerator.validateRegex(
      obj,
      /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/,
    )
  }

  @debug
  static isIpV4(obj: string): boolean {
    return PropertyGenerator.validateRegex(
      obj,
      /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/,
    )
  }

  @debug
  static isJson(obj: string): boolean {
    try {
      JSON.parse(obj)
      return true
    } catch (err) {
      return false
    }
  }

  @debug
  static isHexString(obj: string): boolean {
    return PropertyGenerator.validateRegex(obj, /^[a-fA-F0-9]+$/)
  }

  @debug
  static isBase64String(obj: string): boolean {
    return PropertyGenerator.validateRegex(
      obj,
      /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/,
    )
  }

  @debug
  static isAsciiString(obj: string): boolean {
    return PropertyGenerator.validateRegex(obj, /[ -~]/)
  }

  @debug
  static isUnicodeString(obj: string): boolean {
    return PropertyGenerator.validateRegex(obj, /^[\u0032-\u007F]+/)
  }

  private static validateRegex(obj: string, regex: RegExp): boolean {
    return regex.exec(obj) !== null
  }

  @debug
  static isString(obj: unknown): obj is string {
    return typeof obj === 'string'
  }

  static inferNumber(
    obj: number,
    config?: InferNumberConfig,
  ): fc.Arbitrary<number> | undefined {
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

    return PropertyGenerator.getMinimumArbitrary(inferredArbitraries)
  }

  @debug
  static isBigInt(obj: unknown): obj is bigint {
    return typeof obj === 'bigint'
  }

  @debug
  static isFloat(obj: number): boolean {
    return Number(obj) === obj && obj % 1 !== 0
  }

  @debug
  static isNat(obj: number): boolean {
    return PropertyGenerator.isInteger(obj) && obj >= 0
  }
  @debug
  static isInteger(obj: number): boolean {
    return Number.isSafeInteger(obj)
  }

  @debug
  static isNumber(obj: unknown): obj is number {
    return Number(obj) === obj
  }

  @debug
  static isBoolean(obj: unknown): obj is boolean {
    return typeof obj === 'boolean'
  }

  @debug
  static isRecord(obj: unknown): obj is Record<string, unknown> {
    return typeof obj === 'object' && !Array.isArray(obj) && obj !== null
  }

  @debug
  static isArray(obj: unknown): obj is Array<unknown> {
    return typeof obj === 'object' && Array.isArray(obj) && obj !== null
  }

  static getMinimumArbitrary<T>(
    inferredArbitraries: Array<fc.Arbitrary<T>>,
  ): fc.Arbitrary<T> | undefined {
    if (inferredArbitraries.length === 0) {
      return undefined
    }

    if (inferredArbitraries.length === 1) {
      return inferredArbitraries[0]
    }

    return fc.oneof(...inferredArbitraries) as fc.Arbitrary<T>
  }
}
