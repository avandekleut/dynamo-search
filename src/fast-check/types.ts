export type InferrableFunction<T> =
  | GeneratorFunction<T>
  | BooleanCompareFunction
  | NumericCompareFunction

export type GeneratorFunction<T> = () => T

export type BooleanCompareFunction = CompareFunc<boolean>

export type NumericCompareFunction = CompareFunc<number>

export type CompareFunc<T> = (a: unknown, b: unknown) => T

export type GenericFunction = (...args: unknown[]) => unknown
