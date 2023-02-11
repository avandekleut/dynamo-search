import * as fc from 'fast-check'

import { Obj } from '../obj/Obj'

export class PropertyGenerator {
  static anything(): fc.Arbitrary<unknown> {
    return fc.anything({
      values: [fc.string(), fc.integer(), fc.double(), fc.constant(null)],
    })
  }

  static generateArbitraryFromObject(
    object: unknown,
  ): fc.Arbitrary<typeof object> {
    if (Obj.isString(object)) {
      return fc.string()
    } else if (Obj.isNumber(object)) {
      return fc.oneof(fc.double(), fc.integer())
    } else if (Obj.isBoolean(object)) {
      return fc.boolean()
    } else if (Obj.isNull(object)) {
      return fc.constant(null)
    } else if (Obj.isListType(object)) {
      return fc.array(
        fc.oneof(
          ...object.map((item) =>
            PropertyGenerator.generateArbitraryFromObject(item),
          ),
        ),
      )
    } else if (Obj.isMapType(object)) {
      const result: Record<string, fc.Arbitrary<unknown>> = {}
      Object.keys(object).forEach(function (key, index) {
        result[key] = PropertyGenerator.generateArbitraryFromObject(object[key])
      })
      return fc.record(result)
    } else {
      throw new Error(
        'Unable to generate properties for object:' +
          '\n' +
          JSON.stringify(object, undefined, 2),
      )
    }
  }
}
