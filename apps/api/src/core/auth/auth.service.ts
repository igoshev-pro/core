import { ForbiddenException, HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SuperAdminsService } from '../super-admins/super-admins.service';
import { ClientsService } from '../clients/clients.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly superAdminsService: SuperAdminsService,
    private readonly clientsService: ClientsService,
    private readonly mailService: MailService
  ) { }

  async login(data: { email: string; otp: string }) {
    const user = await this.findUserByEmail(data.email);

    if (!user?._id) throw new HttpException('User not found', 404);

    const result = await this.verifyToken(user.otp, user.email, data.otp);

    if (!result.valid) throw new HttpException("Tokin not valid", 401);

    const payload = { sub: user._id, role: user.role };

    return {
      accessToken: await this.createToken(payload, '7d'),
    };
  }

  // async getOTP(email: string) {
  //   let user = await this.clientsService.findByEmail(email);
  //   user = await this.superAdminsService.findByEmail(email);

  //   if (!user?._id) throw new HttpException('User not found', 404);

  //   const code = this.generateCode();
  //   const token = await this.generateToken(user.email, code, user.role);

  //   await this.superAdminsService.update(user?._id.toString(), { otp: token });

  //   // this.MailService.sendOTPEmail(email, code, user?.name);

  //   return code
  // }

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

    console.log(user)

    // 4. Отправляем email (асинхронно, не ждем)
    this.mailService.sendOTPEmail({
      email: user.email,
      name: user.name,
      otp,
      company: 'Igoshev PRO',
      language: 'ru',
    });
    // this.mailService.sendTestEmail(user.email)

    // 5. Возвращаем ответ
    return otp
  }

  private async findUserByEmail(email: string) {
    // Параллельный поиск в обеих БД
    const [superAdmin, client] = await Promise.all([
      this.superAdminsService.findByEmail(email),
      this.clientsService.findByEmail(email),
    ]);

    if (superAdmin) return superAdmin

    if (client) return client

    return null;
  }

  private async saveUserOTP(user: any, otpToken: string): Promise<void> {
    const updateData = {
      otp: otpToken,
    };

    if (user.type === 'superAdmin') {
      await this.superAdminsService.update(user._id, updateData);
    } else {
      await this.clientsService.update(user._id, updateData);
    }
  }

  async register(data: { email: string; name: string }) {
    await this.clientsService.create(data);

    this.getOTP(data.email);
  }

  async getMe(user: any) {
    // user.sub содержит ID пользователя из JWT токена
    // user.type содержит тип пользователя из токена ('superAdmin' | 'client')

    if (!user?.sub || !user?.type) {
      throw new UnauthorizedException('Invalid user data');
    }

    let userData;

    if (user.type === 'superAdmin') {
      userData = await this.superAdminsService.findOne(user.sub);
    } else if (user.type === 'client') {
      userData = await this.clientsService.findOne(user.sub);
    } else {
      throw new ForbiddenException('Unknown user type');
    }

    if (!userData) {
      throw new NotFoundException('User not found');
    }

    // Убираем чувствительные данные
    const { password, refreshToken, otp, ...safeData } = userData.toObject
      ? userData.toObject()
      : userData;

    return {
      ...safeData,
      type: user.type,
    };
  }

  generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async generateToken(
    email: string,
    code: string,
    role: string,
  ): Promise<string> {
    return this.jwtService.signAsync(
      { email, code, role },
      { expiresIn: '15m' },
    );
  }

  async createToken(payload, expiresIn: string): Promise<string> {
    // @ts-ignore
    return await this.jwtService.signAsync(payload, { expiresIn });
  }

  async verifyToken(
    token: string,
    email: string,
    code: string,
  ): Promise<{ valid: boolean; reason?: string }> {
    try {
      const payload = await this.jwtService.verifyAsync<{
        email: string;
        code: string;
      }>(token);

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
