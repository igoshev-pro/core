import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithProject } from '../types/request.types';

export const ProjectId = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): string | undefined => {
    const req = ctx.switchToHttp().getRequest<RequestWithProject>();
    return (req.projectId ?? req.headers?.['x-project-id']) as string | undefined;
  },
);