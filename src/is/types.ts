import fc from 'fast-check'

type FC = typeof fc

export type FCReflection = Partial<{
  // [K in keyof FC]: create a mapped type that uses the keys from fc
  // FC[K] extends (...args: unknown[]) => fc.Arbitrary<infer X>: only keep keys that correspond to arbitrary factories, and store the corresponding generic type argument X
  // (obj: unknown) => obj is X: for each arbitrary factory in fc, return a type guard for the type used by the arbitrary
  [K in keyof FC]: FC[K] extends (...args: unknown[]) => fc.Arbitrary<infer X>
    ? (obj: unknown) => obj is X
    : never
}>

export type IsConfig = Partial<IsConfigInternal>

export type IsConfigInternal = {
  validateEmptyStrings: boolean
  treatIntegersAsDoubles: boolean
}

export type ValidationFunction = (obj: unknown) => boolean

export type InferrableFunction =
  | Func
  | BooleanCompareFunction
  | NumericCompareFunction

export type Func = (...args: unknown[]) => unknown

export type BooleanCompareFunction = CompareFunc<boolean>

export type NumericCompareFunction = CompareFunc<number>

export type CompareFunc<T> = (a: unknown, b: unknown) => T

export type GenericFunction = (...args: unknown[]) => unknown
