import * as fc from 'fast-check'

import { expect } from '@jest/globals'

import { ArbitraryRepresentation } from './ArbitraryRepresentation'
import { Infer } from './Infer'
import { invertibleArbitraryFactories } from './__data__'
import { testingInferConfig } from './__data__/inferConfig'

const infer = new Infer(testingInferConfig)
const arbitraryRepresentation = new ArbitraryRepresentation()

describe('fixed counterexamples', () => {
  test('email', () => {
    const counterExample = '`a.a@a.aa'
    const arbitrary = fc.emailAddress()
    const inferred = infer.infer(counterExample)
    expect(arbitraryRepresentation.stringify(arbitrary)).toEqual(
      arbitraryRepresentation.stringify(inferred),
    )
  })
})

describe('Infer', () => {
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

  test('infers flat records with invertable arbitraries', () => {
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

  test('infers arrays containing single invertible arbitraries', () => {
    const invertibleArbitraryFactories = [fc.boolean]

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
