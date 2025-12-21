import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRole, UserStatus } from 'src/common/enums/user.unum';
import { ClientsService } from 'src/core/clients/clients.service';
import type { RequestWithAuth } from '../auth/guards/auth.types';

@Injectable()
export class ClientGuard implements CanActivate {
  constructor(private readonly clientsService: ClientsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithAuth>();

    const payload = request.user;
    if (!payload) {
      throw new UnauthorizedException('Missing auth context (JwtAuthGuard)');
    }

    // ✅ Суперадмин проходит всегда
    if (payload.role === UserRole.SuperAdmin) {
      return true;
    }

    // ❌ Ни клиент, ни суперадмин
    if (payload.role !== UserRole.Client) {
      throw new ForbiddenException('Client or SuperAdmin access required');
    }

    // 🔍 Проверка клиента в БД
    const client = await this.clientsService.findOne(payload.sub);
    if (!client) {
      throw new ForbiddenException('Client account not found');
    }

    const ok =
      (client as any).role === UserRole.Client &&
      (client as any).status === UserStatus.Active;

    if (!ok) {
      throw new ForbiddenException('Client account is inactive');
    }

    return true;
  }
}
