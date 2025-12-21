import {
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SuperAdminsService } from '../super-admins/super-admins.service';
import { ClientsService } from '../clients/clients.service';
import { MailService } from '../mail/mail.service';
import { jwtConstants } from './constants';
import { UserRole } from 'src/common/enums/user.unum';
import { UsersService } from 'src/feature/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly superAdminsService: SuperAdminsService,
    private readonly clientsService: ClientsService,
    private readonly mailService: MailService,
    private readonly usersService: UsersService
  ) { }

  async login(data: { email: string; otp: string }, projectId?: string) {
    const user: any = await this.findUserByEmail(data.email);

    if (!user?._id) throw new HttpException('User not found', 404);

    const result = await this.verifyToken(user.otp, user.email, data.otp);

    if (!result.valid) throw new HttpException('Tokin not valid', 401);

    const payload: any = { sub: user._id, role: user.role };
    if (user.role === UserRole.Client && user?.projects?.length) {
      payload.projectId = user.projects[0]?._id
    } else if (user.role === UserRole.User && projectId) {
      payload.projectId = projectId
    }

    return {
      accessToken: await this.createToken(payload),
    };
  }

  async getOTP(email: string) {
    // 1. Ищем пользователя
    const user = await this.findUserByEmail(email);

    if (!user) {
      // Security: не раскрываем, существует ли пользователь
      throw new HttpException('If user exists, OTP will be sent', 404);
    }

    // 2. Генерируем OTP
    const otp = this.generateCode();
    const otpToken = await this.generateToken(user.email, otp, user.role);

    // 3. Сохраняем OTP в соответствующей БД
    await this.saveUserOTP(user, otpToken);

    // 4. Отправляем email (асинхронно, не ждем)
    this.mailService.sendOTPEmail({
      email: user.email,
      name: user.name,
      otp,
      company: 'igoshev.pro',
      language: 'ru',
    });
    this.mailService.sendTestEmail(user.email)

    // 5. Возвращаем ответ
    return otp;
  }

  private async findUserByEmail(email: string) {
    // Параллельный поиск в обеих БД
    const [superAdmin, client, user] = await Promise.all([
      this.superAdminsService.findByEmail(email),
      this.clientsService.findByEmail(email),
      this.usersService.findByEmail(email),
    ]);

    if (superAdmin) return superAdmin;
    if (client) return client;
    if (user) return user;

    console.log(1, superAdmin, client, user)

    return null;
  }

  private async saveUserOTP(user: any, otpToken: string): Promise<void> {
    const updateData = {
      otp: otpToken,
    };

    if (user.role === UserRole.SuperAdmin) {
      await this.superAdminsService.update(user._id, updateData);
    } else if (user.role === UserRole.Client) {
      await this.clientsService.update(user._id, updateData);
    } else {
      await this.usersService.update(user._id, updateData)
    }
  }

  async register(data: { email: string; name: string }) {
    await this.clientsService.create(data);

    this.getOTP(data.email);
  }

  // async getMe(user: any) {
  //   if (!user?.sub || !user?.type) {
  //     throw new UnauthorizedException('Invalid user data');
  //   }

  //   let userData;

  //   if (user.type === 'superAdmin') {
  //     userData = await this.superAdminsService.findOne(user.sub);
  //   } else if (user.type === 'client') {
  //     userData = await this.clientsService.findOne(user.sub);
  //   } else {
  //     throw new ForbiddenException('Unknown user type');
  //   }

  //   if (!userData) {
  //     throw new NotFoundException('User not found');
  //   }

  //   // Убираем чувствительные данные
  //   const { password, refreshToken, otp, ...safeData } = userData.toObject
  //     ? userData.toObject()
  //     : userData;

  //   return {
  //     ...safeData,
  //     type: user.type,
  //   };
  // }

  generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async generateToken(email, code, role): Promise<string> {
    return this.jwtService.signAsync(
      { email, code, role },
      { expiresIn: '15m' },
    );
  }

  async createToken(payload): Promise<string> {
    return await this.jwtService.signAsync(payload, { expiresIn: '7d' });
  }

  async verifyToken(
    token: string,
    email: string,
    code: string,
  ): Promise<{ valid: boolean; reason?: string }> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });

      if (payload.email !== email) {
        return { valid: false, reason: 'EMAIL_MISMATCH' };
      }

      if (payload.code !== code) {
        return { valid: false, reason: 'CODE_MISMATCH' };
      }

      return { valid: true };
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return { valid: false, reason: 'TOKEN_EXPIRED' };
      }
      return { valid: false, reason: 'INVALID_TOKEN' };
    }
  }
}
