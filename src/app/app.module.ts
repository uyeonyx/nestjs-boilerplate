import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from '../common/middleware/logger.middleware';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PrismaModule } from '../modules/prisma/prisma.module';
import { RedisModule } from '../modules/redis/redis.module';
import { S3Module } from '../modules/s3/s3.module';
import { TestModule } from '../modules/test/test.module';
import { WebsocketModule } from '../modules/websocket/websocket.module';
import { ConfigModule } from '../modules/config/config.module';
import { ThrottlerModule } from '../modules/throttler/throttler.module';
import { AuthModule } from '../modules/auth/auth.module';
import { SchedulerModule } from '../modules/scheduler/scheduler.module';

@Module({
  imports: [
    ConfigModule,
    ThrottlerModule,
    AuthModule,
    PrismaModule,
    RedisModule,
    S3Module,
    TestModule,
    WebsocketModule,
    SchedulerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
