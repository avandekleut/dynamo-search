import { largeObjectWithDotsInAttributeNames } from '../../tests/data'

import { Flatten } from './flatten'

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

  it('flattens array containing nested object', () => {
    const objectToFlatten = {
      foo: ['hello', { bar: 'world' }],
    }

    const flattened = Flatten.flatten(objectToFlatten)
    Flatten.safeFlatten(objectToFlatten)

    console.log(flattened)

    expect(flattened).toHaveProperty(['foo.0'], 'hello')
    expect(flattened).toHaveProperty(['foo.1.bar'], 'world')
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
