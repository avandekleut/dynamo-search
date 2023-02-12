import * as fc from 'fast-check'
import { Is } from '../is'
import { Func, GenericFunction } from '../is/types'

import { InferConfig, InferConfigInternal } from './types'

export class Infer {
  private readonly config: InferConfigInternal
  private readonly is: Is

  constructor(config?: InferConfig) {
    this.config = {
      stringSharedConstraints: config?.stringSharedConstraints ?? {},
      jsonSharedConstraints: config?.jsonSharedConstraints ?? {},
      bigIntConstraints: config?.bigIntConstraints ?? {},
      dateConstraints: config?.dateConstraints ?? {},
      emailAddressConstraints: config?.emailAddressConstraints ?? {},
      domainConstraints: config?.domainConstraints ?? {},
      natConstraints: config?.natConstraints ?? {},
      integerConstraints: config?.integerConstraints ?? {},
      doubleConstraints: config?.doubleConstraints ?? {},
    }
    this.is = new Is({
      validateEmptyStrings: false,
    })
  }

  infer = <T>(obj: T): fc.Arbitrary<T> => {
    if (this.is.boolean(obj)) {
      return fc.boolean() as fc.Arbitrary<T>
    }

    if (this.is.bigInt(obj)) {
      return fc.bigInt(this.config.bigIntConstraints) as fc.Arbitrary<T>
    }

    if (this.is.date(obj)) {
      return fc.date(this.config.dateConstraints) as fc.Arbitrary<T>
    }

    if (this.is.null(obj) || this.is.undefined(obj)) {
      return fc.constant(obj) as fc.Arbitrary<T>
    }

    if (this.is.number(obj)) {
      const inferredNumberArbitrary = this.inferNumber(obj)
      if (inferredNumberArbitrary) {
        return inferredNumberArbitrary as fc.Arbitrary<T>
      }
    }

    if (this.is.string(obj)) {
      return this.inferString(obj) as fc.Arbitrary<T>
    }

    if (this.is.function(obj)) {
      return this.inferFunction(obj) as fc.Arbitrary<T>
    }

    if (this.is.array(obj)) {
      return fc.array(
        fc.oneof(...obj.map((item) => this.infer(item))),
      ) as fc.Arbitrary<T>
    }

    if (this.is.record(obj)) {
      const result: Record<string, fc.Arbitrary<unknown>> = {}
      for (const key of Object.keys(obj)) {
        result[key] = this.infer(obj[key])
      }
      return fc.record(result) as fc.Arbitrary<T>
    }

    throw new Error(`Failed to infer arbitrary for ${obj}`)
  }

  inferFunction(obj: GenericFunction): fc.Arbitrary<GenericFunction> {
    if (this.is.compareBooleanFunc(obj)) {
      return fc.compareBooleanFunc()
    }

    if (this.is.compareFunc(obj)) {
      return fc.compareFunc()
    }

    if (this.is.func(obj)) {
      const inferredFunctionArbitrary = this.inferFunc(obj)
      if (inferredFunctionArbitrary) {
        return inferredFunctionArbitrary
      }
    }

    throw new Error(`Failed to infer function: ${obj}`)
  }

  inferFunc(obj: Func): fc.Arbitrary<Func> | undefined {
    const result = obj()
    const inferredResultArbitrary = this.infer(result)
    return fc.func(inferredResultArbitrary) as fc.Arbitrary<Func>
  }

  inferString(obj: string): fc.Arbitrary<string> {
    if (this.is.emailAddress(obj)) {
      return fc.emailAddress(this.config.emailAddressConstraints)
    }

    if (this.is.domain(obj)) {
      return fc.domain(this.config.domainConstraints)
    }

    if (this.is.uuid(obj)) {
      return fc.uuid()
    }

    if (this.is.ipV6(obj)) {
      return fc.ipV6()
    }

    if (this.is.ipV4(obj)) {
      return fc.ipV4()
    }

    if (this.is.json(obj)) {
      return fc.json(this.config.jsonSharedConstraints)
    }

    if (this.is.hexaString(obj)) {
      return fc.hexaString(this.config.stringSharedConstraints)
    }

    if (this.is.base64String(obj)) {
      return fc.base64String(this.config.stringSharedConstraints)
    }

    if (this.is.asciiString(obj)) {
      return fc.asciiString(this.config.stringSharedConstraints)
    }

    if (this.is.unicodeString(obj)) {
      return fc.unicodeString(this.config.stringSharedConstraints)
    }

    return fc.string(this.config.stringSharedConstraints)
  }

  inferNumber(obj: number): fc.Arbitrary<number> {
    if (this.is.nat(obj)) {
      return fc.nat(this.config.natConstraints)
    }

    if (this.is.integer(obj)) {
      return fc.integer(this.config.integerConstraints)
    }

    if (this.is.double(obj)) {
      return fc.double(this.config.doubleConstraints)
    }

    throw new Error(`Failed to infer number: ${obj}`)
  }
}
