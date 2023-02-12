/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ArbitraryRepresentation } from './ArbitraryRepresentation'
import {
  arbitraryFactories,
  uniquelyInferrableArbitraryFactories,
} from './__data__'

const arbitraryRepresentation = new ArbitraryRepresentation()

describe('ArbitraryRepresentation', () => {
  test('generating a sample is consistent', () => {
    for (const arbitraryFactory of arbitraryFactories) {
      const arbitrary = arbitraryFactory()
      expect(arbitraryRepresentation.sample(arbitrary)).toEqual(
        arbitraryRepresentation.sample(arbitrary),
      )
    }
  })

  test('stringifying arbitraries makes them unique', () => {
    const converted = uniquelyInferrableArbitraryFactories.map(
      (arbitraryFactory) => {
        const arbitrary = arbitraryFactory()
        return arbitraryRepresentation.stringify(arbitrary)
      },
    )

    expect(new Set(converted).size).toEqual(converted.length)
  })

  test('stringification is independent of arbitrary instance', () => {
    for (const arbitraryFactory of uniquelyInferrableArbitraryFactories) {
      expect(arbitraryRepresentation.stringify(arbitraryFactory())).toEqual(
        arbitraryRepresentation.stringify(arbitraryFactory()),
      )
    }
  })
})
