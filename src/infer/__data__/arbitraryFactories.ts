/* eslint-disable @typescript-eslint/explicit-function-return-type */
import fc from 'fast-check'
import { inferConfig } from './inferConfig'
import { ArbitraryFactory } from './types'

/** Arbitrary factories that produce samples that can be uniquely linked back to that arbitrary. */
export const uniquelyInferrableArbitraryFactories: Array<ArbitraryFactory> = [
  fc.boolean,
  fc.bigInt,
  fc.date,
  () => fc.constant(null),
  () => fc.constant(undefined),
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
  () => fc.hexaString(inferConfig.stringSharedConstraints),
  () => fc.base64String(inferConfig.stringSharedConstraints),
  () => fc.asciiString(inferConfig.stringSharedConstraints),
  () => fc.unicodeString(inferConfig.stringSharedConstraints),
  () => fc.string(inferConfig.stringSharedConstraints),

  /* json can include literals like "0" that are hard to disambiguate */
  () => fc.json(inferConfig.jsonSharedConstraints),

  /* nat < integer < double */
  fc.integer,
  fc.double,
]

export const arbitraryFactories = [
  ...uniquelyInferrableArbitraryFactories,
  ...ambiguousArbitraryFactories,
]
