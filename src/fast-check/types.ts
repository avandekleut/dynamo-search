import * as fc from 'fast-check'

export type FcConfig = {
  stringSharedConstraints: fc.StringSharedConstraints
  jsonSharedConstraints: fc.JsonSharedConstraints
  bigIntConstraints: fc.BigIntConstraints
  dateConstraints: fc.DateConstraints
  emailAddressConstraints: fc.EmailAddressConstraints
  domainConstraints: fc.DomainConstraints
  natConstraints: fc.NatConstraints
  integerConstraints: fc.IntegerConstraints
  doubleConstraints: fc.DoubleConstraints
}

export type InferrableFunction<T> =
  | GeneratorFunction<T>
  | BooleanCompareFunction
  | NumericCompareFunction

export type GeneratorFunction<T> = () => T

export type BooleanCompareFunction = CompareFunc<boolean>

export type NumericCompareFunction = CompareFunc<number>

export type CompareFunc<T> = (a: unknown, b: unknown) => T

export type GenericFunction = (...args: unknown[]) => unknown
