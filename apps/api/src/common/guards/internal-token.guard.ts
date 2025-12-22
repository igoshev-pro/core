import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class InternalTokenGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest<Request>();
    const token = (req.headers as any)['x-internal-token'] as string | undefined;

    const expected = process.env.CORE_INTERNAL_TOKEN;
    if (!expected) return false;

    return token === expected;
  }
}
