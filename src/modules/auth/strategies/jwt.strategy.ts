import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';

export interface JwtPayload {
  sub: string; // 사용자 ID
  email?: string;
  username?: string;
  roles?: string[];
  admin?: boolean; // 관리자 권한
  iat?: number;
  exp?: number;
  [key: string]: any; // 추가 클레임들을 위한 확장 가능한 구조
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret') || 'default-secret',
    });
  }

  validate(payload: JwtPayload): JwtPayload {
    // 외부에서 발급받은 JWT의 경우, 추가적인 검증 로직을 여기에 구현할 수 있습니다
    // 예: 사용자 존재 여부 확인, 권한 검증 등

    if (!payload.sub) {
      throw new UnauthorizedException('Invalid token payload');
    }

    // 페이로드를 그대로 반환하여 request.user에 저장됩니다
    return payload;
  }
}
