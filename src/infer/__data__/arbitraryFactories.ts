/* eslint-disable @typescript-eslint/explicit-function-return-type */
import fc from 'fast-check'
import { testingInferConfig } from './testingInferConfig'
import { ArbitraryFactory } from './types'

/** Arbitrary factories that produce samples that can be linked back to that arbitrary. */
export const invertibleArbitraryFactories: Array<ArbitraryFactory> = [
  fc.boolean,
  fc.bigInt,
  fc.date,
  () => fc.constant(null),
  // () => fc.constant(undefined), // This one doesn't play nicely with fc.array or fc.record
  fc.compareBooleanFunc,
  fc.compareFunc,
  fc.emailAddress,
  fc.domain,
  fc.uuid,
  fc.ipV4,
  fc.ipV6,
  fc.nat,
]

/** Arbitrary factories that produce samples that could have come from another arbitrary */
export const ambiguousArbitraryFactories: Array<ArbitraryFactory> = [
  /* hex < base64 < ascii < unicode < string */
  () => fc.hexaString(testingInferConfig.stringSharedConstraints),
  () => fc.base64String(testingInferConfig.stringSharedConstraints),
  () => fc.asciiString(testingInferConfig.stringSharedConstraints),
  () => fc.unicodeString(testingInferConfig.stringSharedConstraints),
  () => fc.string(testingInferConfig.stringSharedConstraints),

  /* json can include literals like "0" that are hard to disambiguate */
  () => fc.json(testingInferConfig.jsonSharedConstraints),

  /* nat < integer < double */
  fc.integer,
  fc.double,
]

export const arbitraryFactories = [
  ...invertibleArbitraryFactories,
  ...ambiguousArbitraryFactories,
]
