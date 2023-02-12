import validator from 'validator'
import { debugFactory } from '../logger/debug'

import {
  BooleanCompareFunction,
  FCReflection,
  Func,
  GenericFunction,
  IsConfig,
  IsConfigInternal,
  NumericCompareFunction,
} from './types'

const debug = debugFactory(true)

export class Is implements FCReflection {
  private config: IsConfigInternal
  constructor(config?: IsConfig) {
    this.config = {
      validateEmptyStrings: config?.validateEmptyStrings ?? true,
      treatIntegersAsDoubles: config?.treatIntegersAsDoubles ?? true,
    }
  }

  func(obj: GenericFunction): obj is Func {
    try {
      obj()
      return true
    } catch (err) {
      return false
    }
  }

  compareFunc(obj: GenericFunction): obj is NumericCompareFunction {
    try {
      return this.number(obj(0, 1))
    } catch (err) {
      return false
    }
  }

  compareBooleanFunc(obj: GenericFunction): obj is BooleanCompareFunction {
    try {
      return this.boolean(obj(0, 1))
    } catch (err) {
      return false
    }
  }

  function(obj: unknown): obj is GenericFunction {
    return typeof obj === 'function'
  }

  undefined(obj: unknown): obj is undefined {
    return obj === undefined
  }

  null(obj: unknown): obj is null {
    return obj === null
  }

  date(obj: unknown): obj is Date {
    return obj instanceof Date
  }

  emailAddress(obj: string): obj is string {
    return validator.isEmail(obj)
  }

  domain(obj: string): obj is string {
    return this.validateRegex(
      obj,
      /^(?!.{256})(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(?:[a-z]{1,63}|xn--[a-z0-9]{1,59})$/,
    )
  }

  uuid(obj: string): obj is string {
    return validator.isUUID(obj)
  }

  ipV6(obj: string): obj is string {
    return validator.isIP(obj, '6')
  }

  ipV4(obj: string): obj is string {
    return validator.isIP(obj, '4')
  }

  json(obj: string): obj is string {
    try {
      JSON.parse(obj)
      return true
    } catch (err) {
      return false
    }
  }

  hexaString(obj: string): obj is string {
    return validator.isHexadecimal(obj) || this.validateEmptyString(obj)
  }

  base64String(obj: string): obj is string {
    return validator.isBase64(obj) || this.validateEmptyString(obj)
  }

  asciiString(obj: string): obj is string {
    return (
      // eslint-disable-next-line no-control-regex
      this.validateRegex(obj, /^[\x00-\x7F]*$/) || this.validateEmptyString(obj)
    )
    // return validator.isAscii(obj)
  }

  unicodeString(obj: string): obj is string {
    return this.string(obj)
  }

  validateEmptyString(obj: string): boolean {
    return obj === '' && this.config.validateEmptyStrings
  }

  validateRegex(obj: string, regex: RegExp): boolean {
    return regex.exec(obj) !== null
  }

  string(obj: unknown): obj is string {
    return typeof obj === 'string'
  }

  bigInt(obj: unknown): obj is bigint {
    return typeof obj === 'bigint'
  }

  double(obj: number): obj is number {
    const isInteger = this.config.treatIntegersAsDoubles && this.integer(obj)
    return (Number(obj) === obj && obj % 1 !== 0) || isInteger
  }

  nat(obj: number): obj is number {
    return this.integer(obj) && obj >= 0
  }

  integer(obj: number): obj is number {
    return Number.isInteger(obj)
  }

  number(obj: unknown): obj is number {
    return Number(obj) === obj
  }

  boolean(obj: unknown): obj is boolean {
    return typeof obj === 'boolean'
  }

  record(obj: unknown): obj is Record<string, unknown> {
    return (
      typeof obj === 'object' &&
      !Array.isArray(obj) &&
      obj !== null &&
      !this.date(obj)
    )
  }

  array(obj: unknown): obj is Array<unknown> {
    return typeof obj === 'object' && Array.isArray(obj) && obj !== null
  }
}
