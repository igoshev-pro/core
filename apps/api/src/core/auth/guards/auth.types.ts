import type { Request } from 'express';
import type { UserRole } from 'src/common/enums/user.enum';

export const TENANT_HEADER = 'x-project-id' as const;
export const TENANT_PROJECT_ID = 'tenantProjectId' as const;

export interface JwtPayload {
  sub: string;
  email?: string;
  role: UserRole | string;
  projectId?: string; // кладёшь в JWT
  iat?: number;
  exp?: number;
}

export type RequestWithAuth = Request & {
  user?: JwtPayload;
  [TENANT_PROJECT_ID]?: string;
};
