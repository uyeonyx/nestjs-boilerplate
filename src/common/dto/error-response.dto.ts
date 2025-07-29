import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// 에러 응답 스키마
export const ErrorResponseSchema = z.object({
  statusCode: z.number().int().min(400).max(599).describe('HTTP 상태 코드'),
  message: z.union([z.string(), z.array(z.string())]).describe('에러 메시지'),
  error: z.string().optional().describe('에러 타입'),
  timestamp: z.string().datetime().describe('에러 발생 시간 (ISO 8601 형식)'),
  path: z.string().describe('요청 경로'),
});

export class ErrorResponseDto extends createZodDto(ErrorResponseSchema) {}

// 400 Bad Request 응답
export const BadRequestResponseSchema = z.object({
  statusCode: z.literal(400).describe('HTTP 상태 코드'),
  message: z
    .union([
      z.string().default('잘못된 요청입니다.'),
      z.array(z.string()).default(['name은 필수입니다.', 'email 형식이 올바르지 않습니다.']),
    ])
    .describe('에러 메시지'),
  error: z.literal('Bad Request').describe('에러 타입'),
  timestamp: z.string().datetime().describe('에러 발생 시간').default('2024-01-15T10:30:00.000Z'),
  path: z.string().describe('요청 경로').default('/path/items'),
});

export class BadRequestResponseDto extends createZodDto(BadRequestResponseSchema) {}

// 401 Unauthorized 응답
export const UnauthorizedResponseSchema = z.object({
  statusCode: z.literal(401).describe('HTTP 상태 코드'),
  message: z.literal('Unauthorized').describe('에러 메시지'),
  error: z.literal('Unauthorized').describe('에러 타입'),
  timestamp: z.string().datetime().describe('에러 발생 시간').default('2024-01-15T10:30:00.000Z'),
  path: z.string().describe('요청 경로').default('/path/items'),
});

export class UnauthorizedResponseDto extends createZodDto(UnauthorizedResponseSchema) {}

// 403 Forbidden 응답
export const ForbiddenResponseSchema = z.object({
  statusCode: z.literal(403).describe('HTTP 상태 코드'),
  message: z.literal('Forbidden resource').describe('에러 메시지'),
  error: z.literal('Forbidden').describe('에러 타입'),
  timestamp: z.string().datetime().describe('에러 발생 시간').default('2024-01-15T10:30:00.000Z'),
  path: z.string().describe('요청 경로').default('/path/items'),
});

export class ForbiddenResponseDto extends createZodDto(ForbiddenResponseSchema) {}

// 404 Not Found 응답
export const NotFoundResponseSchema = z.object({
  statusCode: z.literal(404).describe('HTTP 상태 코드'),
  message: z.string().describe('에러 메시지').default('아이템을 찾을 수 없습니다.'),
  error: z.literal('Not Found').describe('에러 타입'),
  timestamp: z.string().datetime().describe('에러 발생 시간').default('2024-01-15T10:30:00.000Z'),
  path: z.string().describe('요청 경로').default('/path/items/999'),
});

export class NotFoundResponseDto extends createZodDto(NotFoundResponseSchema) {}

// 405 Method Not Allowed 응답
export const MethodNotAllowedResponseSchema = z.object({
  statusCode: z.literal(405).describe('HTTP 상태 코드'),
  message: z.literal('Method Not Allowed').describe('에러 메시지'),
  error: z.literal('Method Not Allowed').describe('에러 타입'),
  timestamp: z.string().datetime().describe('에러 발생 시간').default('2024-01-15T10:30:00.000Z'),
  path: z.string().describe('요청 경로').default('/path/items'),
});

export class MethodNotAllowedResponseDto extends createZodDto(MethodNotAllowedResponseSchema) {}

// 409 Conflict 응답
export const ConflictResponseSchema = z.object({
  statusCode: z.literal(409).describe('HTTP 상태 코드'),
  message: z.string().describe('에러 메시지').default('이미 존재하는 리소스입니다.'),
  error: z.literal('Conflict').describe('에러 타입'),
  timestamp: z.string().datetime().describe('에러 발생 시간').default('2024-01-15T10:30:00.000Z'),
  path: z.string().describe('요청 경로').default('/path/items'),
});

export class ConflictResponseDto extends createZodDto(ConflictResponseSchema) {}

// 422 Unprocessable Entity 응답
export const UnprocessableEntityResponseSchema = z.object({
  statusCode: z.literal(422).describe('HTTP 상태 코드'),
  message: z
    .union([
      z.string().default('처리할 수 없는 엔티티입니다.'),
      z.array(z.string()).default(['필드 validation 오류', '비즈니스 규칙 위반']),
    ])
    .describe('에러 메시지'),
  error: z.literal('Unprocessable Entity').describe('에러 타입'),
  timestamp: z.string().datetime().describe('에러 발생 시간').default('2024-01-15T10:30:00.000Z'),
  path: z.string().describe('요청 경로').default('/path/items'),
});

export class UnprocessableEntityResponseDto extends createZodDto(UnprocessableEntityResponseSchema) {}

// 429 Too Many Requests 응답
export const TooManyRequestsResponseSchema = z.object({
  statusCode: z.literal(429).describe('HTTP 상태 코드'),
  message: z.literal('Too Many Requests').describe('에러 메시지'),
  error: z.literal('Too Many Requests').describe('에러 타입'),
  timestamp: z.string().datetime().describe('에러 발생 시간').default('2024-01-15T10:30:00.000Z'),
  path: z.string().describe('요청 경로').default('/path/items'),
});

export class TooManyRequestsResponseDto extends createZodDto(TooManyRequestsResponseSchema) {}

// 500 Internal Server Error 응답
export const InternalServerErrorResponseSchema = z.object({
  statusCode: z.literal(500).describe('HTTP 상태 코드'),
  message: z.literal('Internal Server Error').describe('에러 메시지'),
  error: z.literal('Internal Server Error').describe('에러 타입'),
  timestamp: z.string().datetime().describe('에러 발생 시간').default('2024-01-15T10:30:00.000Z'),
  path: z.string().describe('요청 경로').default('/path/items'),
});

export class InternalServerErrorResponseDto extends createZodDto(InternalServerErrorResponseSchema) {}

// 502 Bad Gateway 응답
export const BadGatewayResponseSchema = z.object({
  statusCode: z.literal(502).describe('HTTP 상태 코드'),
  message: z.literal('Bad Gateway').describe('에러 메시지'),
  error: z.literal('Bad Gateway').describe('에러 타입'),
  timestamp: z.string().datetime().describe('에러 발생 시간').default('2024-01-15T10:30:00.000Z'),
  path: z.string().describe('요청 경로').default('/path/items'),
});

export class BadGatewayResponseDto extends createZodDto(BadGatewayResponseSchema) {}

// 503 Service Unavailable 응답
export const ServiceUnavailableResponseSchema = z.object({
  statusCode: z.literal(503).describe('HTTP 상태 코드'),
  message: z.literal('Service Unavailable').describe('에러 메시지'),
  error: z.literal('Service Unavailable').describe('에러 타입'),
  timestamp: z.string().datetime().describe('에러 발생 시간').default('2024-01-15T10:30:00.000Z'),
  path: z.string().describe('요청 경로').default('/path/items'),
});

export class ServiceUnavailableResponseDto extends createZodDto(ServiceUnavailableResponseSchema) {}

// 504 Gateway Timeout 응답
export const GatewayTimeoutResponseSchema = z.object({
  statusCode: z.literal(504).describe('HTTP 상태 코드'),
  message: z.literal('Gateway Timeout').describe('에러 메시지'),
  error: z.literal('Gateway Timeout').describe('에러 타입'),
  timestamp: z.string().datetime().describe('에러 발생 시간').default('2024-01-15T10:30:00.000Z'),
  path: z.string().describe('요청 경로').default('/path/items'),
});

export class GatewayTimeoutResponseDto extends createZodDto(GatewayTimeoutResponseSchema) {}
