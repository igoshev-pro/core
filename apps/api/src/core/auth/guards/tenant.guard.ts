import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { RequestWithAuth } from './auth.types';
import { TENANT_HEADER, TENANT_PROJECT_ID } from './auth.types';

@Injectable()
export class TenantGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithAuth>();

    const payload = request.user;
    if (!payload) {
      // значит JwtAuthGuard не был подключён
      throw new UnauthorizedException('Missing auth context (JwtAuthGuard)');
    }

    const headerProjectId = this.extractProjectIdFromHeader(request);
    if (!headerProjectId) {
      throw new UnauthorizedException('Missing x-project-id header');
    }

    const tokenProjectId = payload.projectId;
    if (!tokenProjectId) {
      throw new ForbiddenException('Tenant projectId is missing in token');
    }

    if (tokenProjectId !== headerProjectId) {
      throw new ForbiddenException(
        'Tenant mismatch: token projectId differs from x-project-id',
      );
    }

    // важно для tenant DB: провайдер в request scope возьмёт projectId отсюда
    request[TENANT_PROJECT_ID] = tokenProjectId;

    return true;
  }

  private extractProjectIdFromHeader(request: RequestWithAuth): string | undefined {
    const raw = request.headers[TENANT_HEADER] as string | string[] | undefined;
    if (!raw) return undefined;

    const value = Array.isArray(raw) ? raw[0] : raw;
    return value?.trim() || undefined;
  }
}
