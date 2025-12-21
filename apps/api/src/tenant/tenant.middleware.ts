import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TENANT_PROJECT_ID } from './tenant.tokens';

type ReqWithTenant = Request & { [TENANT_PROJECT_ID]?: string };

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: ReqWithTenant, _res: Response, next: NextFunction) {
    // пример: берём из заголовка
    const projectId = (req.headers['x-project-id'] as string | undefined)?.trim();

    if (projectId) {
      req[TENANT_PROJECT_ID] = projectId;
    }

    next();
  }
}
