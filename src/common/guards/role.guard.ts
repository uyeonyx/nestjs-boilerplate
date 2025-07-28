import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { JwtPayload } from '../../modules/auth/strategies/jwt.strategy';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // 역할이 설정되지 않은 경우 통과
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;

    if (!user) {
      throw new ForbiddenException('사용자 인증 정보가 없습니다');
    }

    if (!user.roles || !Array.isArray(user.roles)) {
      throw new ForbiddenException('사용자 역할 정보가 없습니다');
    }

    const hasRequiredRole = requiredRoles.some((role) => user.roles!.includes(role));

    if (!hasRequiredRole) {
      throw new ForbiddenException(`다음 역할 중 하나가 필요합니다: ${requiredRoles.join(', ')}`);
    }

    return true;
  }
}
