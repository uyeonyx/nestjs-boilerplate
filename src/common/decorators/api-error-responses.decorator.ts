import { applyDecorators, Type } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import {
  BadRequestResponseDto,
  UnauthorizedResponseDto,
  ForbiddenResponseDto,
  NotFoundResponseDto,
  MethodNotAllowedResponseDto,
  ConflictResponseDto,
  UnprocessableEntityResponseDto,
  TooManyRequestsResponseDto,
  InternalServerErrorResponseDto,
  BadGatewayResponseDto,
  ServiceUnavailableResponseDto,
  GatewayTimeoutResponseDto,
} from '../dto/error-response.dto';

// 에러 상태 코드와 해당 DTO 매핑
const ERROR_RESPONSE_MAP: Record<number, { dto: Type<any>; description: string }> = {
  400: {
    dto: BadRequestResponseDto,
    description: '잘못된 요청 데이터',
  },
  401: {
    dto: UnauthorizedResponseDto,
    description: '인증되지 않은 요청',
  },
  403: {
    dto: ForbiddenResponseDto,
    description: '권한 부족',
  },
  404: {
    dto: NotFoundResponseDto,
    description: '리소스를 찾을 수 없음',
  },
  405: {
    dto: MethodNotAllowedResponseDto,
    description: '허용되지 않은 메서드',
  },
  409: {
    dto: ConflictResponseDto,
    description: '리소스 충돌',
  },
  422: {
    dto: UnprocessableEntityResponseDto,
    description: '처리할 수 없는 엔티티',
  },
  429: {
    dto: TooManyRequestsResponseDto,
    description: '요청 횟수 제한 초과',
  },
  500: {
    dto: InternalServerErrorResponseDto,
    description: '내부 서버 오류',
  },
  502: {
    dto: BadGatewayResponseDto,
    description: '잘못된 게이트웨이',
  },
  503: {
    dto: ServiceUnavailableResponseDto,
    description: '서비스 사용 불가',
  },
  504: {
    dto: GatewayTimeoutResponseDto,
    description: '게이트웨이 타임아웃',
  },
};

/**
 * 공통 에러 응답들을 자동으로 추가하는 데코레이터
 * @param errorDescriptions 상태코드: 설명 객체
 *
 * @example
 * ```typescript
 * @ApiErrors({
 *   400: '잘못된 요청 데이터',
 *   401: '인증되지 않은 요청',
 *   404: '리소스를 찾을 수 없음'
 * })
 * ```
 */
export function ApiErrors(errorDescriptions: Record<number, string>) {
  const decorators = Object.entries(errorDescriptions).map(([statusCodeStr, description]) => {
    const statusCode = parseInt(statusCodeStr, 10);
    const errorConfig = ERROR_RESPONSE_MAP[statusCode];

    if (!errorConfig) {
      throw new Error(`Unsupported error status code: ${statusCode}`);
    }

    return ApiResponse({
      status: statusCode,
      description,
      type: errorConfig.dto,
    });
  });

  return applyDecorators(...decorators);
}
