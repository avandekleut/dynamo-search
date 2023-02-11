import * as fc from 'fast-check'

import { expect } from '@jest/globals'

import { PropertyGenerator } from './PropertyGenerator'

const testableArbitraries: Array<fc.Arbitrary<unknown>> = [
  // fc.boolean(),
  // fc.bigInt(),
  // fc.bigUint(),
  // fc.date(),
  // fc.constant(null),
  // fc.constant(undefined),
  // fc.compareBooleanFunc(),
  // fc.compareFunc(),
  // fc.emailAddress(),
  // fc.domain(),
  // fc.uuid(),
  // fc.ipV4(),
  // fc.ipV6(),
  // fc.json(),
  // fc.hexaString(),
  // fc.base64String(),
  // fc.asciiString(),
  // fc.unicodeString(),
  // fc.string(),
]

const testableArbitariesFuncs = testableArbitraries.map((arbitrary) =>
  fc.func(arbitrary),
)

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

  // return stringify({ arbitrary, sample }, (key, value) =>
  //   typeof value === 'bigint' ? value.toString() : value,
  // )
  return JSON.stringify({ sample }, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value,
  )
}

describe('stringifyArbitrary', () => {
  test('stringifying arbitraries makes them unique', () => {
    const converted = testableArbitraries.map((arbitrary) =>
      stringifyArbitrary(arbitrary),
    )

    expect(new Set(converted).size).toEqual(converted.length)
  })
})

describe('PropertyGenerator infers from arbitraries', () => {
  test.skip('date', () => {
    const arbitrary = fc.date()
    const sample = fc.sample(arbitrary)[0]

    console.log({ sample })

    const inferredArbitrary = PropertyGenerator.infer(sample)

    const sampleInferred = fc.sample(inferredArbitrary)[0]
    console.log({ sampleInferred })

    expect(stringifyArbitrary(arbitrary)).toEqual(
      stringifyArbitrary(inferredArbitrary),
    )
  })

  test.skip('all basic arbitraries invertible', () => {
    for (const arbitrary of testableArbitraries) {
      const sample = fc.sample(arbitrary)[0]
      const inferredArbitrary = PropertyGenerator.infer(sample)

      expect(stringifyArbitrary(arbitrary)).toEqual(
        stringifyArbitrary(inferredArbitrary),
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
        const inferred = PropertyGenerator.infer(a)
        const sampled = fc.sample(inferred)
        expect(PropertyGenerator.isBoolean(sampled[0])).toBe(true)
      }),
    )
  })
})
