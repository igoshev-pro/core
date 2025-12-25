import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRole, UserStatus } from 'src/common/enums/user.enum';
import { SuperAdminsService } from 'src/core/super-admins/super-admins.service';
import type { RequestWithAuth } from './auth.types';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  constructor(private readonly superAdminsService: SuperAdminsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithAuth>();

    const payload = request.user;
    if (!payload) {
      throw new UnauthorizedException('Missing auth context (JwtAuthGuard)');
    }

    if (payload.role !== UserRole.SuperAdmin) {
      throw new ForbiddenException('Super admin access required');
    }

    const superAdmin = await this.superAdminsService.findOne(payload.sub);
    if (!superAdmin) {
      throw new ForbiddenException('Super admin account not found');
    }

    const ok =
      (superAdmin as any).role === UserRole.SuperAdmin &&
      (superAdmin as any).status === UserStatus.Active;

    if (!ok) {
      throw new ForbiddenException('Super admin account is inactive');
    }

    return true;
  }
}
