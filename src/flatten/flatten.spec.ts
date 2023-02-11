import { largeObjectWithDotsInAttributeNames } from '../../tests/data'
import { flattenObject, typeSafeFlattenObject } from './flatten'

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
