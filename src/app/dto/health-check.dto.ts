import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// 업타임 정보 스키마
export const UptimeSchema = z.object({
  seconds: z.number().int().min(0).describe('서버 실행 시간 (초)'),
  formatted: z.string().describe('포맷된 업타임 문자열 (예: 1d 2h 30m 45s)'),
});

// 메모리 정보 스키마
export const MemorySchema = z.object({
  used: z.number().int().min(0).describe('사용 중인 메모리 (MB)'),
  total: z.number().int().min(0).describe('총 메모리 (MB)'),
  external: z.number().int().min(0).describe('외부 메모리 (MB)'),
  unit: z.literal('MB').describe('메모리 단위'),
});

// 시스템 정보 스키마
export const SystemSchema = z.object({
  platform: z.string().describe('운영체제 플랫폼'),
  arch: z.string().describe('시스템 아키텍처'),
  nodeVersion: z.string().describe('Node.js 버전'),
  cpus: z.number().int().min(1).describe('CPU 코어 수'),
  loadAverage: z.array(z.number()).length(3).describe('시스템 로드 평균 [1분, 5분, 15분]'),
  freeMemory: z.number().int().min(0).describe('사용 가능한 시스템 메모리 (MB)'),
  totalMemory: z.number().int().min(0).describe('총 시스템 메모리 (MB)'),
  memoryUnit: z.literal('MB').describe('메모리 단위'),
});

// 설정 정보 스키마
export const ConfigSchema = z.object({
  port: z.number().int().min(1).max(65535).describe('서버 포트'),
  corsEnabled: z.boolean().describe('CORS 활성화 여부'),
  helmetEnabled: z.boolean().describe('Helmet 보안 헤더 활성화 여부'),
  throttleLimit: z.number().int().min(1).describe('throttle 제한 횟수'),
});

// 헬스체크 응답 스키마
export const HealthCheckSchema = z.object({
  status: z.literal('ok').describe('서버 상태'),
  timestamp: z.string().datetime().describe('응답 생성 시간 (ISO 8601 형식)'),
  uptime: UptimeSchema.describe('서버 업타임 정보'),
  environment: z.string().describe('실행 환경 (development, production 등)'),
  version: z.string().describe('애플리케이션 버전'),
  memory: MemorySchema.describe('메모리 사용량 정보'),
  system: SystemSchema.describe('시스템 정보'),
  config: ConfigSchema.describe('서버 설정 정보'),
});

export class HealthCheckDto extends createZodDto(HealthCheckSchema) {}
