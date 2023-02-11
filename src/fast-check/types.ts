export type InferConfig = InferStringConfig & InferNumberConfig

export type InferStringConfig = {
  inferMostSpecificStringType?: boolean
}

export type InferNumberConfig = EmptyConfig

export type EmptyConfig = Record<string, never>

export type GeneratorFunc<T> = () => T

export type BooleanCompareFunc = CompareFunc<boolean>

export type NumericCompareFunc = CompareFunc<number>

export type CompareFunc<T> = (a: unknown, b: unknown) => T

export type GenericFunction = (...args: unknown[]) => unknown
