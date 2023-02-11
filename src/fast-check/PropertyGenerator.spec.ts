import * as fc from 'fast-check'
import { FlattenableObject } from '../object-inspector'
import { PropertyGenerator } from './PropertyGenerator'

describe('PropertyGenerator', () => {
  test.skip('simple object', () => {
    const object = {
      foo: 'bar',
    }
    const properties = PropertyGenerator.getProperties(object)
    console.log({ properties })

    fc.assert(fc.property({ foo: fc.string() }))

    fc.assert(
      fc.property(
        PropertyGenerator.getProperties(object),
        (generatedObject) => {
          console.log({ generatedObject })
          expect(generatedObject.foo).toBe('string')
        },
      ),
    )
  })

  test.skip('complex object', () => {
    const object: FlattenableObject = {
      session: 1234,
      id: 'ad780446-f330-494d-945d-ae1777f2c23b',
      event: {
        headers: {
          'x-api-key': '3e47abdb-f77d-4aa7-94c9-87c3df7381a0',
        },
      },
      records: [
        {
          complete: false,
          status: 400,
          message: 'failed to upload.',
        },
      ],
    }
    fc.assert(
      fc.property(PropertyGenerator.getProperties(object), (obj) => {
        // Alternatively: no return statement and direct usage of expect or assert
        const object = obj as FlattenableObject
        expect(object).toHaveProperty(['event.headers.x-api-key'], fc.string())
      }),
    )
  })
})
