import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { JwtPayload } from '../../modules/auth/strategies/jwt.strategy';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;

    if (!user) {
      throw new ForbiddenException('사용자 인증 정보가 없습니다');
    }

    if (!user.admin) {
      throw new ForbiddenException('관리자 권한이 필요합니다');
    }

    return true;
  }
}
