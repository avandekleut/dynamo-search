import fc from 'fast-check'
import { Is } from './Is'

const is = new Is()

type ArbitraryFactory<T> = (...args: unknown[]) => fc.Arbitrary<T>
type Validator<T> = (obj: unknown) => obj is T

type AssertCanIdentify = <T>(v: Validator<T>, a: ArbitraryFactory<T>) => void

const assertCanIdentify: AssertCanIdentify = (validator, arbitraryFactory) => {
  const arbitrary = arbitraryFactory()
  fc.assert(
    fc.property(arbitrary, (sample) => {
      expect(validator(sample)).toBe(true)
    }),
  )
}

describe('Is', () => {
  test('asciiString', () => {
    assertCanIdentify(is.asciiString.bind(is), fc.asciiString)
  })

  test('base64String', () => {
    assertCanIdentify(is.base64String.bind(is), fc.base64String)
  })

  test('bigInt', () => {
    assertCanIdentify(is.bigInt.bind(is), fc.bigInt)
  })

  test('boolean', () => {
    assertCanIdentify(is.boolean.bind(is), fc.boolean)
  })

  test('compareBooleanFunc', () => {
    assertCanIdentify(is.compareBooleanFunc.bind(is), fc.compareBooleanFunc)
  })

  test('compareFunc', () => {
    assertCanIdentify(is.compareFunc.bind(is), fc.compareFunc)
  })

  test('date', () => {
    assertCanIdentify(is.date.bind(is), fc.date)
  })

  test('domain', () => {
    assertCanIdentify(is.domain.bind(is), fc.domain)
  })

  test('double', () => {
    assertCanIdentify(is.double.bind(is), fc.double)
  })

  test('emailAddress', () => {
    assertCanIdentify(is.emailAddress.bind(is), fc.emailAddress)
  })
  test('func', () => {
    assertCanIdentify(is.func.bind(is), () => fc.func(fc.string()))
  })
  test('hexastring', () => {
    assertCanIdentify(is.hexaString.bind(is), fc.hexaString)
  })
  test('integer', () => {
    assertCanIdentify(is.integer.bind(is), fc.integer)
  })
  test('ipv4', () => {
    assertCanIdentify(is.ipV4.bind(is), fc.ipV4)
  })
  test('ipv6', () => {
    assertCanIdentify(is.ipV6.bind(is), fc.ipV6)
  })
  test('json', () => {
    assertCanIdentify(is.json.bind(is), fc.json)
  })
  test('nat', () => {
    assertCanIdentify(is.nat.bind(is), fc.nat)
  })
  test('record', () => {
    assertCanIdentify(is.record.bind(is), () => fc.record({ x: fc.string() }))
  })
  test('string', () => {
    assertCanIdentify(is.string.bind(is), fc.string)
  })
  test('unicode', () => {
    assertCanIdentify(is.unicodeString.bind(is), fc.unicodeString)
  })
  test('uuid', () => {
    assertCanIdentify(is.uuid.bind(is), fc.uuid)
  })
})
