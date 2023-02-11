export type InferConfig = InferStringConfig & InferNumberConfig

export type InferStringConfig = {
  inferMostSpecificStringType?: boolean
}

export type InferNumberConfig = EmptyConfig

export type EmptyConfig = Record<string, never>
