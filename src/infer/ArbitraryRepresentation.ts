import fc from 'fast-check'
import { stringify } from 'flatted'
import { Is } from '../is'
import { GenericFunction } from '../is/types'

/**
 * Utility class for converting an fc.Arbitrary<unknown> into a unique string
 * representation. This class is used to test the outputs of the Infer class.
 */
export class ArbitraryRepresentation {
  private readonly is = new Is()
  constructor(private readonly seed = 0) {}

  stringify(arbitrary: fc.Arbitrary<unknown>): string {
    const sample = this.sample(arbitrary)

    try {
      return JSON.stringify({ arbitrary, sample }, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value,
      )
    } catch (err) {
      return stringify({ arbitrary, sample }, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value,
      )
    }
  }

  private sampleFunction(sampled: GenericFunction): unknown {
    if (this.is.compareBooleanFunc(sampled) || this.is.compareFunc(sampled)) {
      return sampled(0, 1)
    } else if (this.is.func(sampled)) {
      return sampled()
    } else {
      throw new Error(
        `Could not generate representative sample from function ${sampled}`,
      )
    }
  }

  /**
   * Recursively sample from an arbitrary.
   *
   * For scalar arbitraries, directly returns sample.
   *
   * For function arbitraries, tries to sample function by calling it with two
   * arguments (compare functions) and no arguments (funcs).
   *
   * For array and record arbitraries, tries to replace the arbitraries
   * recursively with samples from those arbitraries.
   */
  sample(arbitrary: fc.Arbitrary<unknown>): unknown {
    const sampled = fc.sample(arbitrary, { seed: this.seed })[0]
    if (this.is.function(sampled)) {
      return this.sampleFunction(sampled)
    } else if (this.is.array(sampled)) {
      return sampled.map((e) => {
        if (e instanceof fc.Arbitrary<unknown>) {
          return this.sample(e)
        } else if (this.is.function(e)) {
          return this.sampleFunction(e)
        }
        return e
      })
    } else if (this.is.record(sampled)) {
      const result: Record<string, unknown> = {}
      for (const key of Object.keys(sampled)) {
        const e = sampled[key]
        if (e instanceof fc.Arbitrary<unknown>) {
          result[key] = this.sample(e)
        } else if (this.is.function(e)) {
          result[key] = this.sampleFunction(e)
        } else {
          result[key] = e
        }
        return result
      }
    } else {
      return sampled
    }
  }
}
