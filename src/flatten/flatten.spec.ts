import { largeObjectWithDotsInAttributeNames } from '../../tests/data'
import { flattenObject, typeSafeFlattenObject } from './flatten'

import * as fc from 'fast-check'
import { sort } from '../src/sort'

test('should contain the same items', () => {
  const count = (tab: unknown, element: unknown) =>
    tab.filter((v) => v === element).length
  fc.assert(
    fc.property(fc.array(fc.integer()), (data) => {
      const sorted = sort(data)
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
      const sorted = sort(data)
      for (let idx = 1; idx < sorted.length; ++idx) {
        expect(sorted[idx - 1]).toBeLessThanOrEqual(sorted[idx])
      }
    }),
  )
})

describe('flattenObject', () => {
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

    const flattened = flattenObject(objectToFlatten)
    typeSafeFlattenObject(objectToFlatten)
    expect(flattened).toHaveProperty(['foo.bar'], 'hello world')
  })

  it('flattens array', () => {
    const objectToFlatten = {
      foo: ['hello', 'world'],
    }

    const flattened = flattenObject(objectToFlatten)
    typeSafeFlattenObject(objectToFlatten)
    expect(flattened).toHaveProperty(['foo.0'], 'hello')
    expect(flattened).toHaveProperty(['foo.1'], 'world')
  })

  it('flattens with empty array', () => {
    const objectToFlatten = {
      foo: [],
    }

    const flattened = flattenObject(objectToFlatten)
    typeSafeFlattenObject(objectToFlatten)
    expect(flattened).toHaveProperty(['foo'], [])
  })

  it('flattens with empty object', () => {
    const objectToFlatten = {
      foo: {},
    }

    const flattened = flattenObject(objectToFlatten)
    typeSafeFlattenObject(objectToFlatten)
    expect(flattened).toHaveProperty(['foo'], {})
  })

  it('handles edge cases', () => {
    const flattened = flattenObject(largeObjectWithDotsInAttributeNames)
    console.log({ flattened })

    expect(flattened).toHaveProperty('not_lost', [])
    expect(flattened).toHaveProperty('not_lost2', {})
  })
})
