import fc from 'fast-check'
import { stringify } from 'flatted'
import { Is } from '../is'

/**
 * Utility class for converting an fc.Arbitrary<unknown> into a unique string
 * representation. This class is used to test the outputs of the Infer class.
 */
export class ArbitraryRepresentation {
  constructor(private readonly is = new Is()) {}

  stringify(arbitrary: fc.Arbitrary<unknown>): string {
    const sample = this.sample(arbitrary)

    return stringify({ arbitrary, sample }, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value,
    )
  }

  sample(arbitrary: fc.Arbitrary<unknown>, seed = 0): unknown {
    const sample = fc.sample(arbitrary, { seed })[0]
    if (this.is.function(sample)) {
      if (
        this.is.compareBooleanFunc(sample) ||
        this.is.compareBooleanFunc(sample)
      ) {
        return sample(0, 1)
      } else if (this.is.func(sample)) {
        return sample()
      } else {
        throw new Error(
          `Could not generate representative sample from function ${sample}`,
        )
      }
    } else {
      return sample
    }
  }
}
