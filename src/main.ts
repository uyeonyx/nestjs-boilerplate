import { NestFactory, Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { patchNestJsSwagger, ZodValidationPipe } from 'nestjs-zod';
import helmet from 'helmet';
import { AppModule } from './modules/app/app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { PinoLoggerService } from './common/logger/pino-logger.service';
import { PackageUtil } from './common/utils/package.util';
import { SwaggerUtil } from './common/utils/swagger.util';

// nestjs-zod 패치 적용
patchNestJsSwagger();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new PinoLoggerService(),
  });

  const configService = app.get(ConfigService);

  // Swagger 설정
  SwaggerUtil.setupDefault(app, []);

  // 보안 헤더 설정 (Helmet)
  if (configService.get('security.helmet.enabled')) {
    app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com'],
            scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com'],
            imgSrc: ["'self'", 'data:', 'https:'],
            connectSrc: ["'self'"],
            fontSrc: ["'self'", 'https://cdnjs.cloudflare.com'],
          },
        },
        crossOriginEmbedderPolicy: false,
      }),
    );
  }

  // CORS 설정
  app.enableCors({
    origin: configService.get('cors.origin'),
    credentials: configService.get('cors.credentials'),
    methods: configService.get('cors.methods'),
    allowedHeaders: configService.get('cors.allowedHeaders'),
  });

  // 전역 설정
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalGuards(new JwtAuthGuard(app.get(Reflector)));
  app.useGlobalPipes(new ZodValidationPipe());

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  const baseUrl = `http://localhost:${port}`;
  console.log(`🚀 Application is running on: ${baseUrl}`);
  console.log(`📚 Swagger documentation: ${SwaggerUtil.getDocumentationUrl(baseUrl)}`);
  console.log(`📦 ${PackageUtil.getName()} v${PackageUtil.getVersion()}`);
}
void bootstrap();
