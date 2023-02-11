import { ConsoleLogger } from './ConsoleLogger'
import { Logger } from './Logger'

let logger: Logger

export class LoggerFactory {
  static getInstance() {
    if (!logger) {
      logger = new ConsoleLogger()
    }

    return logger
  }
}
