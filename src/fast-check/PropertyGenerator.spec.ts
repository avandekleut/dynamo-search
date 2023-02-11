import * as fc from 'fast-check'

import { expect } from '@jest/globals'

import { PropertyGenerator } from './PropertyGenerator'

function convertArbitraryToObject(
  arbitrary: fc.Arbitrary<unknown>,
): Record<string, unknown> {
  return JSON.parse(
    JSON.stringify({
      arbitrary,
      type: Object.prototype.constructor(arbitrary).name,
    }),
  )
}

describe('PropertyGenerator infers from sampled arbitraries', () => {
  const testableArbitraries: Array<fc.Arbitrary<unknown>> = [
    fc.boolean(),
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
    // fc.ipV4(),
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

  test('stringifying arbitraries makes them unique', () => {
    const converted = testableArbitraries.map((arbitrary) =>
      JSON.stringify(convertArbitraryToObject(arbitrary)),
    )
    expect(new Set(converted).size).toEqual(converted.length)
  })

  test('basic boolean', () => {
    const arbitrary = fc.boolean()
    expect(JSON.stringify(arbitrary)).toEqual(
      JSON.stringify(PropertyGenerator.infer(fc.sample(arbitrary)[0])),
    )
  })

  test('all basic arbitraries invertible', () => {
    for (const arbitrary of testableArbitraries) {
      const sampled = fc.sample(arbitrary)[0]
      const inferredArbitrary = PropertyGenerator.infer(sampled)
      expect(JSON.stringify(arbitrary)).toEqual(
        JSON.stringify(inferredArbitrary),
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

  test.skip('identity', () => {
    for (const arbitrary of testableArbitraries) {
      fc.assert(
        fc.property(arbitrary, (generated) => {
          const inferred = PropertyGenerator.infer(generated)

          expect(convertArbitraryToObject(inferred)).toMatchObject(
            convertArbitraryToObject(arbitrary),
          )
        }),
      )
    }
  })
})
