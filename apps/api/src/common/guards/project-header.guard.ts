import { CanActivate, ExecutionContext, Injectable, BadRequestException } from '@nestjs/common';
import { RequestWithProject } from '../types/request.types';

@Injectable()
export class ProjectHeaderGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest<RequestWithProject>();

    const projectId = req.headers?.['x-project-id'] as string | undefined;
    if (!projectId || typeof projectId !== 'string') {
      throw new BadRequestException('x-project-id header is required');
    }

    // Если хочешь — тут можно добавить простую валидацию формата ObjectId:
    // if (!/^[a-f\d]{24}$/i.test(projectId)) throw new BadRequestException('Invalid x-project-id');

    req.projectId = projectId;
    return true;
  }
}
