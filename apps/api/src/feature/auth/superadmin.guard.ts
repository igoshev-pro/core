import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../user/user.entity';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // user должен быть добавлен AuthGuard'ом (JWT)

    if (!user) {
      throw new ForbiddenException('Пользователь не найден');
    }

    if (user?.role !== UserRole.SuperAdmin) {
      throw new ForbiddenException('Доступ разрешен только администраторам');
    }

    return true;
  }
}
