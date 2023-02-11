import * as fc from 'fast-check'

import { ObjectInspector } from '../object-inspector/ObjectInspector'

export class PropertyGenerator {
  static getProperties(object: unknown): fc.Arbitrary<unknown> {
    console.log(`getProperties called with object: ${object}`)

    switch (typeof object) {
      case 'string':
        return fc.string()
      case 'number':
        return fc.double()
      case 'bigint':
        return fc.bigInt()
      case 'boolean':
        return fc.boolean()
    }

    if (ObjectInspector.isRecursivelyFlattenableObject(object)) {
      if (Array.isArray(object)) {
        return fc.array(
          fc.oneof(
            ...object.map((obj) => PropertyGenerator.getProperties(obj)),
          ),
        )
      } else {
        const result: Record<string, fc.Arbitrary<unknown>> = {}
        Object.keys(object).forEach(function (key, index) {
          console.log(
            `Applying to ${JSON.stringify(object, undefined, 2)} at key ${key}`,
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
