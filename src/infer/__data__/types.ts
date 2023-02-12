import fc from 'fast-check'

export type ArbitraryFactory = () => fc.Arbitrary<unknown>
