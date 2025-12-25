import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRole } from 'src/common/enums/user.unum';
import type { RequestWithAuth } from '../auth/guards/auth.types';
import { ProjectsService } from 'src/core/projects/projects.service';
import { TENANT_HEADER } from '../auth/guards/guards.types';

@Injectable()
export class ProjectAccessGuard implements CanActivate {
  constructor(private readonly projectsService: ProjectsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithAuth>();

    const user = request.user;
    if (!user) {
      throw new UnauthorizedException('Missing auth context');
    }

    // ✅ SuperAdmin всегда проходит
    if (user.role === UserRole.SuperAdmin) return true;

    // projectId обязателен
    const projectId = this.extractProjectIdFromHeader(request);
    if (!projectId) {
      throw new UnauthorizedException('Missing x-project-id header');
    }

    // Загружаем проект из CORE DB (общая база)
    const project = await this.projectsService.findOne(projectId);
    if (!project) {
      throw new ForbiddenException('Project not found');
    }

    // ✅ вариант 1: владелец
    const ownerId = String((project as any).ownerId ?? (project as any).clientId ?? '');
    if (ownerId && ownerId === String(user.sub)) return true;

    // ✅ вариант 2 (если у тебя есть доступы/участники):
    // if (Array.isArray((project as any).members) && (project as any).members.includes(user.id)) return true;

    throw new ForbiddenException('You have no access to this project');
  }

  private extractProjectIdFromHeader(request: any): string | undefined {
    const raw = request.headers[TENANT_HEADER] as string | string[] | undefined;
    if (!raw) return undefined;
    const value = Array.isArray(raw) ? raw[0] : raw;
    return value?.trim() || undefined;
  }
}
