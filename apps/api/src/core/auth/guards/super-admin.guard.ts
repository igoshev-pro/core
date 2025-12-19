import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserRole, UserStatus } from 'src/common/enums/user.unum';
import { SuperAdminsService } from 'src/core/super-admins/super-admins.service';
import { jwtConstants } from '../constants'

@Injectable()
export class SuperAdminGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly superAdminsService: SuperAdminsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // 1. Получаем токен из запроса
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('No authentication token provided');
    }

    try {
      // 2. Верифицируем токен
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });

      // 3. Проверяем, что пользователь суперадмин
      if (payload.role !== 'superAdmin') {
        throw new ForbiddenException('Super admin access required');
      }

      // 4. Проверяем дополнительно по базе (опционально)
      const isValidAdmin = await this.validateSuperAdminInDb(payload.sub);
      if (!isValidAdmin) {
        throw new ForbiddenException(
          'Super admin account not found or inactive',
        );
      }

      // 5. Добавляем пользователя в request
      // @ts-ignore
      request.user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
      };

      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private async validateSuperAdminInDb(userId: string): Promise<boolean> {
    const superAdmin = await this.superAdminsService.findOne(userId);

    if (
      !superAdmin ||
      superAdmin?.role !== UserRole.SuperAdmin ||
      superAdmin?.status !== UserStatus.Active
    )
      return false;

    return true;
  }
}
