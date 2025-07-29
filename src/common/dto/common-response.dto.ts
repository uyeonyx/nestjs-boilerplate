import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// 공통 응답 스키마
export const CommonResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: dataSchema.describe('응답 데이터'),
    statusCode: z.number().int().min(200).max(599).describe('HTTP 상태 코드').default(200),
    message: z.string().describe('응답 메시지').default('Success'),
    timestamp: z.string().datetime().describe('응답 시간 (ISO 8601 형식)').default('2024-01-15T10:30:00.000Z'),
  });

// 기본 성공 응답
export const SuccessResponseSchema = CommonResponseSchema(z.any());
export class SuccessResponseDto extends createZodDto(SuccessResponseSchema) {}

// 문자열 응답
export const StringResponseSchema = CommonResponseSchema(z.string());
export class StringResponseDto extends createZodDto(StringResponseSchema) {}

// 불린 응답
export const BooleanResponseSchema = CommonResponseSchema(z.boolean());
export class BooleanResponseDto extends createZodDto(BooleanResponseSchema) {}

// 널 응답 (삭제 등)
export const NullResponseSchema = CommonResponseSchema(z.null());
export class NullResponseDto extends createZodDto(NullResponseSchema) {}
