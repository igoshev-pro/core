import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { otpMailTemplate } from './template/otp-mail.template';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendOTPEmail(email: string, otp: string, name?: string) {
    const mail = otpMailTemplate({
      email,
      name,
      otp,
      company: 'Igoshev PRO',
      logoUrl: 'https://api.igoshev.de/logo-core.png',
      primaryColor: '#22C55E',
      language: 'ru',
    });

    await this.mailerService.sendMail(mail);
  }
}
