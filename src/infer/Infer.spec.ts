import * as fc from 'fast-check'

import { expect } from '@jest/globals'

import { ArbitraryRepresentation } from './ArbitraryRepresentation'
import { Infer } from './Infer'
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

describe.skip('pending counterexamples', () => {
  test('hex', () => {
    const counterExample = '1000000000'
    const arbitrary = fc.hexaString()
    const inferred = infer.infer(counterExample)
    expect(arbitraryRepresentation.stringify(arbitrary)).toEqual(
      arbitraryRepresentation.stringify(inferred),
    )
  })

  test('ascii', () => {
    const counterExample = '"++//A++///+/"'
    const arbitrary = fc.ascii()
    const inferred = infer.infer(counterExample)
    expect(arbitraryRepresentation.stringify(arbitrary)).toEqual(
      arbitraryRepresentation.stringify(inferred),
    )
  })
})
