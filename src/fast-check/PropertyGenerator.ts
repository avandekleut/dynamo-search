import * as fc from 'fast-check'

import { ObjectInspector } from '../object-inspector/ObjectInspector'

export class PropertyGenerator {
  static getProperties(object: unknown): fc.Arbitrary<typeof object> {
    console.log(
      `getProperties called with object: ${JSON.stringify(
        object,
        undefined,
        2,
      )}`,
    )

    switch (typeof object) {
      case 'string':
        console.log('string')
        return fc.string()
      case 'number':
        console.log('number')
        return fc.double()
      case 'bigint':
        console.log('int')
        return fc.bigInt()
      case 'boolean':
        console.log('boolean')
        return fc.boolean()
    }

    if (ObjectInspector.isRecursivelyFlattenableObject(object)) {
      if (Array.isArray(object)) {
        console.log('array')
        return fc.array(
          fc.oneof(
            ...object.map((obj) => PropertyGenerator.getProperties(obj)),
          ),
        )
      } else {
        console.log('object')
        const result: Record<string, fc.Arbitrary<unknown>> = {}
        Object.keys(object).forEach(function (key, index) {
          console.log(
            `Getting properties of ${JSON.stringify(
              object,
              undefined,
              2,
            )} at key ${key}`,
          )
          result[key] = PropertyGenerator.getProperties(object[key])
        })
        return fc.object(result)
      }
    } else {
      throw new Error(
        'Unable to generate properties for object:' +
          '\n' +
          JSON.stringify(object, undefined, 2),
      )
    }
  }
}
