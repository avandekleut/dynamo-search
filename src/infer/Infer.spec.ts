import * as fc from 'fast-check'

import { expect } from '@jest/globals'

import { ArbitraryRepresentation } from './ArbitraryRepresentation'
import { Infer } from './Infer'
import { uniquelyInferrableArbitraryFactories } from './__data__'
import { inferConfig } from './__data__/inferConfig'

const infer = new Infer(inferConfig)
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
  test('inverts all invertable arbitraries', () => {
    for (const arbitraryFactory of uniquelyInferrableArbitraryFactories) {
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
})
