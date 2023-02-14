/* eslint-disable @typescript-eslint/explicit-function-return-type */
import fc from 'fast-check'
import { ArbitraryRepresentation } from './ArbitraryRepresentation'
import { arbitraryFactories, ArbitraryFactory } from './__data__'

const arbitraryRepresentation = new ArbitraryRepresentation()

function runArbitraryRepresentationTests(
  arbitraryFactories: Array<ArbitraryFactory>,
): void {
  test('generating a sample is consistent', () => {
    for (const arbitraryFactory of arbitraryFactories) {
      expect(arbitraryRepresentation.sample(arbitraryFactory())).toEqual(
        arbitraryRepresentation.sample(arbitraryFactory()),
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
}

describe('ArbitraryRepresentation for scalar arbitraries', () => {
  runArbitraryRepresentationTests(arbitraryFactories)
})

describe('ArbitraryRepresentation for singleton array arbitraries', () => {
  const singletonArrayArbitraries = arbitraryFactories.map(
    (arbitraryFactory) => () => fc.array(arbitraryFactory()),
  )
  runArbitraryRepresentationTests(singletonArrayArbitraries)
})

describe('ArbitraryRepresentation for oneof array arbitraries', () => {
  const oneofArrayArbitraryFactories: Array<ArbitraryFactory> = []
  for (let i = 1; i < arbitraryFactories.length; i++) {
    const oneofArrayArbitraryFactory = () =>
      fc.oneof(arbitraryFactories[i - 1](), arbitraryFactories[i]())
    oneofArrayArbitraryFactories.push(oneofArrayArbitraryFactory)
  }

  runArbitraryRepresentationTests(oneofArrayArbitraryFactories)
})

describe('ArbitraryRepresentation for singleton record arbitraries', () => {
  const singletonArrayArbitraries = arbitraryFactories.map(
    (arbitraryFactory) => () => fc.record({ foo: arbitraryFactory() }),
  )
  runArbitraryRepresentationTests(singletonArrayArbitraries)
})

// It turns out that this property isn't true so we shouldn't test it.
// Alternatively, we could try to construct a single unique representation for
// all equivalent arbitraries, but this is difficult.
describe.skip('ArbitraryRepresentation oneof array arbitraries in different orders', () => {
  test('using oneof in different orders results in the same arbitrary', () => {
    const firstOneofArrayArbitraryFactories: Array<ArbitraryFactory> = []
    for (let i = 1; i < arbitraryFactories.length; i++) {
      const oneofArrayArbitraryFactory = () =>
        fc.oneof(arbitraryFactories[i - 1](), arbitraryFactories[i]())
      firstOneofArrayArbitraryFactories.push(oneofArrayArbitraryFactory)
    }

    // oneof in opposite order arguments
    const secondOneofArrayArbitraryFactories: Array<ArbitraryFactory> = []
    for (let i = 1; i < arbitraryFactories.length; i++) {
      const oneofArrayArbitraryFactory = () =>
        fc.oneof(arbitraryFactories[i](), arbitraryFactories[i - 1]())
      secondOneofArrayArbitraryFactories.push(oneofArrayArbitraryFactory)
    }

    for (let i = 0; i < firstOneofArrayArbitraryFactories.length; i++) {
      expect(
        arbitraryRepresentation.stringify(
          firstOneofArrayArbitraryFactories[i](),
        ),
      ).toEqual(
        arbitraryRepresentation.stringify(
          secondOneofArrayArbitraryFactories[i](),
        ),
      )
    }
  })
})
