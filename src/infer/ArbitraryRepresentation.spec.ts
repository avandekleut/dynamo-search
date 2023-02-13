/* eslint-disable @typescript-eslint/explicit-function-return-type */
import fc from 'fast-check'
import { ArbitraryRepresentation } from './ArbitraryRepresentation'
import { arbitraryFactories } from './__data__'

const arbitraryRepresentation = new ArbitraryRepresentation()

describe('ArbitraryRepresentation for scalar arbitraries', () => {
  test('generating a sample is consistent', () => {
    for (const arbitraryFactory of arbitraryFactories) {
      const arbitrary = arbitraryFactory()
      expect(arbitraryRepresentation.sample(arbitrary)).toEqual(
        arbitraryRepresentation.sample(arbitrary),
      )
    }
  })

  test('stringifying arbitraries makes them unique', () => {
    const stringified = arbitraryFactories.map((arbitraryFactory) => {
      const arbitrary = arbitraryFactory()
      return arbitraryRepresentation.stringify(arbitrary)
    })

    expect(new Set(stringified).size).toEqual(stringified.length)
  })

  test('stringification is independent of arbitrary instance', () => {
    for (const arbitraryFactory of arbitraryFactories) {
      expect(arbitraryRepresentation.stringify(arbitraryFactory())).toEqual(
        arbitraryRepresentation.stringify(arbitraryFactory()),
      )
    }
  })
})

describe('ArbitraryRepresentation for array arbitraries', () => {
  test('generating a sample is consistent', () => {
    for (const arbitraryFactory of arbitraryFactories) {
      const arbitrary = fc.array(arbitraryFactory())
      expect(arbitraryRepresentation.sample(arbitrary)).toEqual(
        arbitraryRepresentation.sample(arbitrary),
      )
    }
  })

  test('stringifying arbitraries makes them unique', () => {
    const stringified = arbitraryFactories.map((arbitraryFactory) => {
      const arbitrary = fc.array(arbitraryFactory())
      return arbitraryRepresentation.stringify(arbitrary)
    })

    expect(new Set(stringified).size).toEqual(stringified.length)
  })

  test('stringification is independent of arbitrary instance', () => {
    for (const arbitraryFactory of arbitraryFactories) {
      expect(
        arbitraryRepresentation.stringify(fc.array(arbitraryFactory())),
      ).toEqual(arbitraryRepresentation.stringify(fc.array(arbitraryFactory())))
    }
  })
})

describe('ArbitraryRepresentation for record arbitraries', () => {
  test('generating a sample is consistent', () => {
    for (const arbitraryFactory of arbitraryFactories) {
      const arbitrary = fc.record({ foo: arbitraryFactory() })
      expect(arbitraryRepresentation.sample(arbitrary)).toEqual(
        arbitraryRepresentation.sample(arbitrary),
      )
    }
  })

  test('stringifying arbitraries makes them unique', () => {
    const converted = arbitraryFactories.map((arbitraryFactory) => {
      const arbitrary = fc.record({ foo: arbitraryFactory() })
      return arbitraryRepresentation.stringify(arbitrary)
    })

    expect(new Set(converted).size).toEqual(converted.length)
  })

  test('stringification is independent of arbitrary instance', () => {
    for (const arbitraryFactory of arbitraryFactories) {
      expect(
        arbitraryRepresentation.stringify(
          fc.record({ foo: arbitraryFactory() }),
        ),
      ).toEqual(
        arbitraryRepresentation.stringify(
          fc.record({ foo: arbitraryFactory() }),
        ),
      )
    }
  })
})
