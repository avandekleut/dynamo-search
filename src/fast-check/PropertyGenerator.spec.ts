import * as fc from 'fast-check'
import {
  largeObjectWithDotsInAttributeNames,
  smallFlatObject,
} from '../../tests/data'
import { Obj } from '../obj'

import { PropertyGenerator } from './PropertyGenerator'

describe('PropertyGenerator', () => {
  test('generateArbitraryFromObject(smallFlatObject)', () => {
    const arbitrary =
      PropertyGenerator.generateArbitraryFromObject(smallFlatObject)

    fc.assert(
      fc.property(arbitrary, (generated) => {
        console.log({ generated })
        expect(typeof generated.string).toBe('string')
        expect(typeof generated.number).toBe('number')
        expect(typeof generated.boolean).toBe('boolean')
        expect(generated.null).toBe(null)
      }),
    )
  })

  test.skip('generateArbitraryFromObject(largeObjectWithDotsInAttributeNames)', () => {
    const arbitrary = PropertyGenerator.generateArbitraryFromObject(
      largeObjectWithDotsInAttributeNames,
    )

    fc.assert(
      fc.property(arbitrary, (generated) => {
        console.log({ generated })

        expect(typeof generated.value.foo.bar).toBe('string')
        expect(typeof generated.value.foo.so.freakin.nested).toBe('string')
        expect(Obj.isListType(generated.not_lost)).toBe(true)
        expect(Obj.isEmptyList(generated.not_lost)).toBe(true)
        expect(Obj.isMapType(generated.not_lost2)).toBe(true)
        expect(Obj.isEmptyMap(generated.not_lost2)).toBe(true)
      }),
    )
  })
})
