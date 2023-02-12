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
    console.log('registering debugFactory')

    const targetMethod = descriptor.value

    console.log(`targetMethod: ${targetMethod}`)

    descriptor.value = function (...args: any[]) {
      logger.log(`${propertyKey}(${args})`)

      const result = targetMethod.apply(this, args)

      if (verbose) {
        logger.log(`${propertyKey}(${args}) = ${result}`)
      }
      return result
    }
  }
}
