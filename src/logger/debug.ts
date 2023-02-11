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
      if (verbose) {
        logger.log(`Calling ${propertyKey} with args ${args}`)
      }
      const result = targetMethod.apply(this, args)
      if (verbose) {
        logger.log(`Function returned: ${result}`)
      }
      return result
    }
  }
}
