import * as fc from 'fast-check'

import { expect } from '@jest/globals'

import { stringify } from 'flatted'
import { PropertyGenerator } from './PropertyGenerator'
import { Config } from './types'

const testConfig: Config = {
  stringSharedConstraints: {
    minLength: 1,
  },
}

const propertyGenerator = new PropertyGenerator(testConfig)

const arbitraryFactories: Array<() => fc.Arbitrary<unknown>> = [
  // () => fc.boolean(),
  // () => fc.bigInt(),
  // () => fc.date(),
  // () => fc.constant(null),
  // () => fc.constant(undefined),
  // () => fc.compareBooleanFunc(),
  // () => fc.compareFunc(),
  () => fc.emailAddress(), // TODO: Fix
  // () => fc.domain(),
  // () => fc.uuid(),
  // () => fc.ipV4(),
  // () => fc.ipV6(), // TODO: Fix
  // () => fc.json(),
  // () => fc.hexaString(testConfig.stringSharedConstraints),
  // () => fc.base64String(testConfig.stringSharedConstraints),
  // () => fc.asciiString(testConfig.stringSharedConstraints),
  // () => fc.unicodeString(testConfig.stringSharedConstraints),
  // () => fc.string(testConfig.stringSharedConstraints),
  // () => fc.nat(),
  // () => fc.integer(),
  // () => fc.double(),
]

// const testableArbitariesFuncs = arbitraryFactories.map((arbitraryFactory) =>
//   () => fc.func(arbitraryFactory()),
// )

function generateRepresentativeSample(
  arbitrary: fc.Arbitrary<unknown>,
  seed = 0,
): unknown {
  const sample = fc.sample(arbitrary, { seed })[0]
  if (PropertyGenerator.isFunction(sample)) {
    if (
      PropertyGenerator.isNumericCompareFunction(sample) ||
      PropertyGenerator.isBooleanCompareFunction(sample)
    ) {
      return sample(0, 1)
    } else if (PropertyGenerator.isGeneratorFunction(sample)) {
      return sample()
    }
  } else {
    return sample
  }
}

function stringifyArbitrary(arbitrary: fc.Arbitrary<unknown>): string {
  const sample = generateRepresentativeSample(arbitrary)

  return stringify({ arbitrary, sample }, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value,
  )
  // return JSON.stringify({ sample, arbitrary }, (key, value) =>
  //   typeof value === 'bigint' ? value.toString() : value,
  // )
}

describe('test for testing code', () => {
  test('generating a representative sample is consistent', () => {
    for (const arbitraryFactory of arbitraryFactories) {
      const arbitrary = arbitraryFactory()
      expect(generateRepresentativeSample(arbitrary)).toEqual(
        generateRepresentativeSample(arbitrary),
      )
    }
  })

  test('stringifying arbitraries makes them unique', () => {
    const converted = arbitraryFactories.map((arbitraryFactory) => {
      const arbitrary = arbitraryFactory()
      return stringifyArbitrary(arbitrary)
    })

    expect(new Set(converted).size).toEqual(converted.length)
  })

  test('stringification is independent of arbitrary instance', () => {
    for (const arbitraryFactory of arbitraryFactories) {
      expect(stringifyArbitrary(arbitraryFactory())).toEqual(
        stringifyArbitrary(arbitraryFactory()),
      )
    }
  })
})

describe('PropertyGenerator infers from arbitraries', () => {
  test('email counterexample', () => {
    const email = '`a.a@a.aa'
    const arbitrary = fc.emailAddress()
    const inferred = propertyGenerator.infer(email)
    expect(stringifyArbitrary(arbitrary)).toEqual(stringifyArbitrary(inferred))
  })

  test.skip('all basic arbitraries invertible', () => {
    for (const arbitraryFactory of arbitraryFactories) {
      const arbitrary = arbitraryFactory()
      fc.assert(
        fc.property(arbitrary, (a) => {
          const inferredArbitrary = propertyGenerator.infer(a)

          expect(stringifyArbitrary(arbitrary)).toEqual(
            stringifyArbitrary(inferredArbitrary),
          )
        }),
      )
    }
  })

  test.skip('isBoolean', () => {
    fc.assert(
      fc.property(fc.boolean(), (a) => {
        expect(PropertyGenerator.isBoolean(a)).toBe(true)
        expect(PropertyGenerator.isNumber(a)).toBe(false)
        expect(PropertyGenerator.isString(a)).toBe(false)
        expect(PropertyGenerator.isArray(a)).toBe(false)
        expect(PropertyGenerator.isRecord(a)).toBe(false)
      }),
    )
  })

  test.skip('infer boolean', () => {
    fc.assert(
      fc.property(fc.boolean(), (a) => {
        const inferred = propertyGenerator.infer(a)
        const sampled = fc.sample(inferred)
        expect(PropertyGenerator.isBoolean(sampled[0])).toBe(true)
      }),
    )
  })
})
