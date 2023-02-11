import * as fc from 'fast-check'

describe('fast-check', () => {
  test('should contain the same items', () => {
    const count = (tab: Array<unknown>, element: unknown) =>
      tab.filter((v) => v === element).length
    fc.assert(
      fc.property(fc.array(fc.integer()), (data) => {
        const sorted = data.sort()
        expect(sorted.length).toEqual(data.length)
        for (const item of data) {
          expect(count(sorted, item)).toEqual(count(data, item))
        }
      }),
    )
  })

  test('should produce ordered array', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (data) => {
        const sorted = data.sort(function (a, b) {
          return a - b
        })
        for (let idx = 1; idx < sorted.length; ++idx) {
          expect(sorted[idx - 1]).toBeLessThanOrEqual(sorted[idx])
        }
      }),
    )
  })
})
