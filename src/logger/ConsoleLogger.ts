import { Logger } from './Logger'

export class ConsoleLogger implements Logger {
  log(message: unknown): void {
    console.log(message)
  }
}
