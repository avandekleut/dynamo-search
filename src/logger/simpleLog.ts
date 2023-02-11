import { LoggerFactory } from './LoggerFactory'

const logger = LoggerFactory.getInstance()

/**
 * Decorator factory for class method decorator.
 */
export function simpleLog() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const targetMethod = descriptor.value

    descriptor.value = function (...args: any[]) {
      logger.log(`Calling ${propertyKey} with args ${args}`)
      const result = targetMethod.apply(this, args)
      logger.log(`Function returned: ${result}`)
      return result
    }
  }
}
