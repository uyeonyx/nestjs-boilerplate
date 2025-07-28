import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { Public } from '../../common/decorators/public.decorator';
import { SkipThrottle } from '@nestjs/throttler';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('ping')
  @Public()
  @SkipThrottle()
  ping(@Res() res: Response): void {
    // 인터셉터를 무시하고 플레인 텍스트로 응답
    res.set('Content-Type', 'text/plain');
    res.send('pong');
  }

  @Get('health')
  @Public()
  @SkipThrottle()
  getHealth() {
    return this.appService.getHealthCheck();
  }
}
