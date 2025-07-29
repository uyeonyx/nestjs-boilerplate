import { Injectable, LoggerService } from '@nestjs/common';
import pino from 'pino';

@Injectable()
export class PinoLoggerService implements LoggerService {
  private readonly logger: pino.Logger;

  constructor() {
    this.logger = pino({
      level: process.env.LOG_LEVEL || 'info',
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'yyyy-mm-dd HH:MM:ss',
          ignore: 'pid,hostname',
        },
      },
    });

    // Console override - 모든 console.log를 pino logger로 대체
    this.overrideConsole();
  }

  private overrideConsole() {
    console.log = (...args) => this.logger.info(args.join(' '));
    console.info = (...args) => this.logger.info(args.join(' '));
    console.warn = (...args) => this.logger.warn(args.join(' '));
    console.error = (...args) => this.logger.error(args.join(' '));
    console.debug = (...args) => this.logger.debug(args.join(' '));
  }

  log(message: any, context?: string) {
    this.logger.info({ context }, message);
  }

  error(message: any, trace?: string, context?: string) {
    this.logger.error({ context, trace }, message);
  }

  warn(message: any, context?: string) {
    this.logger.warn({ context }, message);
  }

  debug(message: any, context?: string) {
    this.logger.debug({ context }, message);
  }

  verbose(message: any, context?: string) {
    this.logger.trace({ context }, message);
  }

  getLogger() {
    return this.logger;
  }
}
