import { flattenObject, typeSafeFlattenObject } from '../src/flatten/flatten.js'

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
    const objectToFlatten = {
      value: {
        foo: {
          bar: 'yes',
          so: {
            freakin: {
              nested: 'Wow',
              date: new Date(),
            },
          },
        },
      },
      test: [true, false, [null, undefined, 1]],
      not_lost: [], // Empty arrays should be preserved
      not_lost2: {}, // Empty objects should be preserved
      // Be careful with object having dots in the keys
      'I.like.dots..in.object.keys...': "... Please don't override me",
      I: {
        like: {
          'dots..in': {
            object: {
              'keys...': "You've been overwritten",
            },
          },
        },
      },
    }
    const flattened = flattenObject(objectToFlatten)
    console.log({ flattened })

    expect(flattened).toHaveProperty('not_lost', [])
    expect(flattened).toHaveProperty('not_lost2', {})
  })
})
