import * as fc from 'fast-check'

import { expect } from '@jest/globals'

import { ArbitraryRepresentation } from './ArbitraryRepresentation'
import { Infer } from './Infer'
import { invertibleArbitraryFactories } from './__data__'
import { testingInferConfig } from './__data__/testingInferConfig'

const infer = new Infer(testingInferConfig)
const arbitraryRepresentation = new ArbitraryRepresentation()

// TODO: Test more complex nested structures and objects

describe.skip('fixed counterexamples', () => {
  test('email', () => {
    const counterExample = '`a.a@a.aa'
    const arbitrary = fc.emailAddress()
    const inferred = infer.infer(counterExample)
    expect(arbitraryRepresentation.stringify(arbitrary)).toEqual(
      arbitraryRepresentation.stringify(inferred),
    )
  })
})

describe.skip('Infer (simple)', () => {
  test('infers all invertable arbitraries', () => {
    for (const arbitraryFactory of invertibleArbitraryFactories) {
      const arbitrary = arbitraryFactory()
      fc.assert(
        fc.property(arbitrary, (sample) => {
          const inferred = infer.infer(sample)
          expect(arbitraryRepresentation.stringify(arbitrary)).toEqual(
            arbitraryRepresentation.stringify(inferred),
          )
        }),
      )
    }
  })

  test.skip('infers flat records with invertable arbitraries', () => {
    const flatRecordOfInvertibleArbitraries: Record<
      string,
      fc.Arbitrary<unknown>
    > = {}
    /** Build a flat record of all invertible arbitraries */
    invertibleArbitraryFactories.forEach((arbitraryFactory, i) => {
      flatRecordOfInvertibleArbitraries[i] = arbitraryFactory()
    })

    const simpleRecordArbitrary = fc.record(flatRecordOfInvertibleArbitraries)

    fc.assert(
      fc.property(simpleRecordArbitrary, (sample) => {
        const inferred = infer.infer(sample)
        expect(
          arbitraryRepresentation.stringify(simpleRecordArbitrary),
        ).toEqual(arbitraryRepresentation.stringify(inferred))
      }),
    )
  })

  test.skip('infers arrays containing single invertible arbitraries', () => {
    for (const arbitraryFactory of invertibleArbitraryFactories) {
      const arrayArbitrary = fc.array(
        arbitraryFactory(),
        testingInferConfig.arrayConstraints,
      )

      fc.assert(
        fc.property(arrayArbitrary, (sample) => {
          const inferred = infer.infer(sample)
          expect(arbitraryRepresentation.stringify(arrayArbitrary)).toEqual(
            arbitraryRepresentation.stringify(inferred),
          )
        }),
      )
    }
  })
})

describe('Infer (complex)', () => {
  // it turns out that fc.oneof(arb1, arb2) returns different results than
  // fc.oneof(arb2, arb1)
  test.skip('infers arrays containing two invertible arbitraries', () => {
    for (let i = 1; i < invertibleArbitraryFactories.length; i++) {
      const arrayArbitrary = fc.array(
        fc.oneof(
          invertibleArbitraryFactories[i - 1](),
          invertibleArbitraryFactories[i](),
        ),
        testingInferConfig.arrayConstraints,
      )

      fc.assert(
        fc.property(arrayArbitrary, (sample) => {
          const inferred = infer.infer(sample)
          expect(arbitraryRepresentation.stringify(arrayArbitrary)).toEqual(
            arbitraryRepresentation.stringify(inferred),
          )
        }),
      )
    }
  })

  test.skip('infers nested records of invertible arbitraries', () => {
    for (let i = 3; i < invertibleArbitraryFactories.length; i++) {
      const nestedRecordArbitrary = fc.record({
        a: invertibleArbitraryFactories[i - 3](),
        b: fc.record({
          c: invertibleArbitraryFactories[i - 2](),
          d: invertibleArbitraryFactories[i - 1](),
          e: fc.record({
            f: invertibleArbitraryFactories[i](),
          }),
        }),
      })

      fc.assert(
        fc.property(nestedRecordArbitrary, (sample) => {
          const inferred = infer.infer(sample)
          expect(
            arbitraryRepresentation.stringify(nestedRecordArbitrary),
          ).toEqual(arbitraryRepresentation.stringify(inferred))
        }),
      )
    }
  })

  test.skip('infers nested records of invertible arbitraries or singleton array arbitraries', () => {
    for (let i = 3; i < invertibleArbitraryFactories.length; i++) {
      const nestedRecordArbitrary = fc.record({
        a: invertibleArbitraryFactories[i - 3](),
        b: fc.record({
          c: fc.array(
            invertibleArbitraryFactories[i - 2](),
            testingInferConfig.arrayConstraints,
          ),
          d: invertibleArbitraryFactories[i - 1](),
          e: fc.record({
            f: fc.array(
              invertibleArbitraryFactories[i](),
              testingInferConfig.arrayConstraints,
            ),
          }),
        }),
      })

      fc.assert(
        fc.property(nestedRecordArbitrary, (sample) => {
          const inferred = infer.infer(sample)
          expect(
            arbitraryRepresentation.stringify(nestedRecordArbitrary),
          ).toEqual(arbitraryRepresentation.stringify(inferred))
        }),
      )
    }
  })
})
