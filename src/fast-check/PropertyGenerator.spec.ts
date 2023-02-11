import * as fc from 'fast-check'
import { smallFlatObject } from '../../tests/data'

import { PropertyGenerator } from './PropertyGenerator'

describe('PropertyGenerator', () => {
  test.skip('anything', () => {
    fc.assert(
      fc.property(PropertyGenerator.anything(), (anything) => {
        //
      }),
    )
  })

  test('generateArbitraryFromObject(smallFlatObject)', () => {
    const arbitrary =
      PropertyGenerator.generateArbitraryFromObject(smallFlatObject)

    fc.assert(
      fc.property(arbitrary, (obj) => {
        console.log({ obj })
      }),
    )
  })
})
