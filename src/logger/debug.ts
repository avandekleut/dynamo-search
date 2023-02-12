import { LoggerFactory } from './LoggerFactory'

const logger = LoggerFactory.getInstance()

/**
 * Decorator factory for class method decorator.
 */
export function debugFactory(verbose = true) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const targetMethod = descriptor.value

    descriptor.value = function (...args: any[]) {
      const result = targetMethod.apply(this, args)
      if (verbose) {
        logger.log(`${propertyKey}(${args}) = ${result}`)
      }
      return result
    }
  }
}
