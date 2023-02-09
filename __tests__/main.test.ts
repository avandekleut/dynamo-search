import { flattenObject } from '../src/main.js'

describe('greeter function', () => {
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
})
