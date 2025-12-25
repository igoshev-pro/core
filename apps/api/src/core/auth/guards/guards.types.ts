import type { Request } from 'express';
import type { UserRole } from 'src/common/enums/user.unum';

/**
 * Header name для tenant/project
 * Используй везде одинаково
 */
export const TENANT_HEADER = 'x-project-id';

/**
 * Symbol / key для прокидывания projectId
 * в request для tenant DB provider
 */
export const TENANT_PROJECT_ID = Symbol('TENANT_PROJECT_ID');

/**
 * Базовый payload JWT
 * (то, что ты реально кладёшь в токен)
 */
export interface JwtPayloadBase {
  sub: string;          // user id
  email: string;
  role: UserRole;
  projectId?: string;   // может быть, но не обязателен
  iat?: number;
  exp?: number;
}

/**
 * User, который кладётся в request.user
 * ЕДИНЫЙ контракт для всех гардов
 */
export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  projectId?: string;
}

/**
 * Request с auth-контекстом
 */
export interface RequestWithAuth extends Request {
  user?: AuthUser;
  [TENANT_PROJECT_ID]?: string;
}
