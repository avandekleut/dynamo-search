import { largeObjectWithDotsInAttributeNames } from '../../tests/data'

import * as fc from 'fast-check'
import { Flatten } from './flatten'

test('should contain the same items', () => {
  const count = (tab: Array<unknown>, element: unknown) =>
    tab.filter((v) => v === element).length
  fc.assert(
    fc.property(fc.array(fc.integer()), (data) => {
      const sorted = data.sort()
      expect(sorted.length).toEqual(data.length)
      for (const item of data) {
        expect(count(sorted, item)).toEqual(count(data, item))
      }
    }),
  )
})

test('should produce ordered array', () => {
  fc.assert(
    fc.property(fc.array(fc.integer()), (data) => {
      const sorted = data.sort(function (a, b) {
        return a - b
      })
      for (let idx = 1; idx < sorted.length; ++idx) {
        expect(sorted[idx - 1]).toBeLessThanOrEqual(sorted[idx])
      }
    }),
  )
})

describe('Flatten.flatten', () => {
  beforeAll(async () => {
    return
  })

  afterAll(() => {
    return
  })

  it('flattens basic object', () => {
    const objectToFlatten = {
      foo: {
        bar: 'hello world',
      },
    }

    const flattened = Flatten.flatten(objectToFlatten)
    Flatten.safeFlatten(objectToFlatten)
    expect(flattened).toHaveProperty(['foo.bar'], 'hello world')
  })

  it('flattens array', () => {
    const objectToFlatten = {
      foo: ['hello', 'world'],
    }

    const flattened = Flatten.flatten(objectToFlatten)
    Flatten.safeFlatten(objectToFlatten)
    expect(flattened).toHaveProperty(['foo.0'], 'hello')
    expect(flattened).toHaveProperty(['foo.1'], 'world')
  })

  it('flattens with empty array', () => {
    const objectToFlatten = {
      foo: [],
    }

    const flattened = Flatten.flatten(objectToFlatten)
    Flatten.safeFlatten(objectToFlatten)
    expect(flattened).toHaveProperty(['foo'], [])
  })

  it('flattens with empty object', () => {
    const objectToFlatten = {
      foo: {},
    }

    const flattened = Flatten.flatten(objectToFlatten)
    Flatten.safeFlatten(objectToFlatten)
    expect(flattened).toHaveProperty(['foo'], {})
  })

  it('handles edge cases', () => {
    const flattened = Flatten.flatten(largeObjectWithDotsInAttributeNames)

    expect(flattened).toHaveProperty('not_lost', [])
    expect(flattened).toHaveProperty('not_lost2', {})
  })
})
