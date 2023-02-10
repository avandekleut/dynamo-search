import { flattenObject } from '../src/main.js'

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
    expect(flattened).toHaveProperty(['foo.bar'], 'hello world')
  })

  it('flattens array', () => {
    const objectToFlatten = {
      foo: ['hello', 'world'],
    }

    const flattened = flattenObject(objectToFlatten)
    expect(flattened).toHaveProperty(['foo.0'], 'hello')
    expect(flattened).toHaveProperty(['foo.1'], 'world')
  })

  it('handles edge cases', () => {
    const obj = {
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
    const flattened = flattenObject(obj)

    expect(flattened).toHaveProperty('not_lost')
    expect(flattened).toHaveProperty('not_lost2')
  })
})
