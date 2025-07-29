import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { CommonResponseSchema } from '../../common/dto/common-response.dto';
import { HealthCheckSchema } from './health-check.dto';

// 헬스체크 응답 스키마
export const HealthCheckResponseSchema = CommonResponseSchema(HealthCheckSchema);
export class HealthCheckResponseDto extends createZodDto(HealthCheckResponseSchema) {}

// 사용자 프로필 스키마
export const UserProfileSchema = z.object({
  sub: z.string().describe('사용자 ID'),
  email: z.string().email().describe('이메일'),
  username: z.string().describe('사용자명'),
  roles: z.array(z.string()).describe('권한 목록'),
  iat: z.number().describe('토큰 발급 시간'),
  exp: z.number().describe('토큰 만료 시간'),
});

export const ProfileDataSchema = z.object({
  message: z.string().describe('응답 메시지'),
  user: UserProfileSchema.describe('사용자 정보'),
});

export const ProfileResponseSchema = CommonResponseSchema(ProfileDataSchema);
export class ProfileResponseDto extends createZodDto(ProfileResponseSchema) {}
