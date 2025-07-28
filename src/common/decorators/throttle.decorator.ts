import { SetMetadata } from '@nestjs/common';
import { Throttle as NestThrottle } from '@nestjs/throttler';

export const Throttle = (options: { limit: number; ttl: number }) => {
  return NestThrottle({ default: { limit: options.limit, ttl: options.ttl } });
};

export const SkipThrottle = (skip = true) => SetMetadata('skipThrottle', skip);

// 미리 정의된 Rate Limiting 프리셋
export const StrictRateLimit = () => Throttle({ limit: 10, ttl: 60000 }); // 1분에 10회
export const ModerateRateLimit = () => Throttle({ limit: 50, ttl: 60000 }); // 1분에 50회
export const LenientRateLimit = () => Throttle({ limit: 200, ttl: 60000 }); // 1분에 200회
