import { Controller, Get, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { AppService } from './app.service';
import { Public } from '../common/decorators/public.decorator';
import { SkipThrottle } from '@nestjs/throttler';
import { HealthCheckDto } from './dto/health-check.dto';
import { HealthCheckResponseDto, ProfileResponseDto } from './dto/app-response.dto';
import { ApiErrors } from '../common/decorators/api-error-responses.decorator';
import { User } from '../common/decorators/user.decorator';
import { JwtPayload } from '../modules/auth/strategies/jwt.strategy';

@ApiTags('Application')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('ping')
  @Public()
  @SkipThrottle()
  @ApiOperation({
    summary: 'Ping 테스트',
    description: '서버 연결 상태를 확인하는 간단한 ping 테스트입니다.',
  })
  @ApiResponse({
    status: 200,
    description: 'Pong 응답 (인터셉터 우회, 플레인 텍스트)',
    schema: {
      type: 'string',
      example: 'pong',
      description: 'Pong 응답 문자열',
    },
  })
  ping(@Res() res: Response): void {
    // 인터셉터를 무시하고 플레인 텍스트로 응답
    res.set('Content-Type', 'text/plain');
    res.send('pong');
  }

  @Get('health')
  @Public()
  @SkipThrottle()
  @ApiOperation({
    summary: '서버 헬스체크',
    description: '서버의 상태, 시스템 정보, 메모리 사용량 등을 확인할 수 있는 헬스체크 엔드포인트입니다.',
  })
  @ApiResponse({
    status: 200,
    description: '서버 헬스체크 정보 (전역 인터셉터에 의해 변환됨)',
    type: HealthCheckResponseDto,
  })
  getHealth(): HealthCheckDto {
    return this.appService.getHealthCheck();
  }

  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '사용자 프로필 조회',
    description: 'JWT 토큰을 통해 인증된 사용자의 프로필 정보를 반환합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 프로필 정보 (전역 인터셉터에 의해 변환됨)',
    type: ProfileResponseDto,
  })
  @ApiErrors({
    401: '인증되지 않은 요청',
    403: '권한 부족',
  })
  getProfile(@User() user: JwtPayload) {
    return {
      message: '인증된 사용자 정보',
      user,
    };
  }
}
