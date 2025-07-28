import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import pino from 'pino';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = pino({
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'yyyy-mm-dd HH:MM:ss',
        ignore: 'pid,hostname',
      },
    },
  });

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const { method, ip, headers } = req;
    const url = req.originalUrl || req.url;

    // 요청 시점 로깅
    this.logger.info(
      {
        type: 'request',
        method,
        url,
        ip,
        userAgent: headers['user-agent'],
      },
      `→ ${method} ${url}`,
    );

    // 응답 완료 시점 로깅
    const originalSend = res.send;
    const logger = this.logger;

    res.send = function (body) {
      const responseTime = Date.now() - startTime;
      const { statusCode } = res;

      // 로그 레벨 결정
      const logLevel = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';

      logger[logLevel](
        {
          type: 'response',
          method,
          url,
          ip,
          statusCode,
          responseTime,
        },
        `← ${method} ${url} ${statusCode} (${responseTime}ms)`,
      );

      return originalSend.call(this, body);
    };

    next();
  }
}
