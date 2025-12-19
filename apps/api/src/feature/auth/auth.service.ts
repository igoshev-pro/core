import { HttpException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { MailService } from '../mail/mail.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly MailService: MailService,
  ) {}

  async login(data: { email: string; otp: string }) {
    const user = await this.userService.findByEmail(data.email);
    if (!user?._id) throw new HttpException('User not found', 404);

    const result = await this.verifyToken(user.otp, user.email, data.otp);
    if (!result.valid) throw new HttpException(result.reason, 401);

    const payload = { sub: user._id, role: user.role };

    return {
      accessToken: await this.createToken(payload, '7d'),
    };
  }

  async getOTP(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user?._id) throw new HttpException('User not found', 404);

    const code = this.generateCode();
    const token = await this.generateToken(user.email, code);

    await this.userService.update(user?._id.toString(), { otp: token });

    this.MailService.sendOTPEmail(email, code, user?.name);
  }

  async register(data: { email: string; name: string }) {
    await this.userService.create(data);

    this.getOTP(data.email);
  }

  async getMe(user: any) {
    return await this.userService.findOne(user.sub);
  }

  generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async generateToken(email: string, code: string): Promise<string> {
    return this.jwtService.signAsync({ email, code }, { expiresIn: '15m' });
  }

  async createToken(payload, expiresIn: string): Promise<string> {
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
