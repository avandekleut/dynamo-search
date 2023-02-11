import * as fc from 'fast-check'

import { expect } from '@jest/globals'

import { LoggerFactory } from '../logger/LoggerFactory'
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

  test('boolean', () => {
    const booleanArbitrary = fc.boolean()
    const booleanExample = fc.sample(booleanArbitrary)
    const inferredArbitrary = PropertyGenerator.infer(booleanExample)

    const logger = LoggerFactory.getInstance()
    // expect(convertArbitraryToObject(inferredArbitrary)).toMatchObject(
    //   convertArbitraryToObject(booleanArbitrary),
    // )
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
