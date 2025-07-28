import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { ZodValidationPipe } from './common/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 전역 설정
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalGuards(new JwtAuthGuard(app.get(Reflector)));
  app.useGlobalPipes(new ZodValidationPipe());

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
