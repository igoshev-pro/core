import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

interface SendOTPEmailOptions {
  email: string;
  name?: string;
  otp: string;
  company?: string;
  logoUrl?: string;
  primaryColor?: string;
  language?: 'ru' | 'en';
}


@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly mailerService: MailerService) {}

  /**
   * Отправка OTP кода для входа
   */
  async sendOTPEmail(options: SendOTPEmailOptions): Promise<boolean> {
    try {
      const {
        email,
        name,
        otp,
        company = 'Igoshev PRO',
        logoUrl = 'https://api.igoshev.de/logo-core.png',
        primaryColor = '#22C55E',
        language = 'ru',
      } = options;

      this.logger.log(`Отправка OTP кода на ${email}`);

      const subject = language === 'ru'
        ? `Код для входа в панель управления ${company}`
        : `Your ${company} login code`;

      await this.mailerService.sendMail({
        to: email,
        subject,
        template: 'otp', // имя шаблона без расширения .hbs
        context: {
          email,
          name,
          otp,
          company,
          logoUrl,
          primaryColor,
          language,
          subject,
          year: new Date().getFullYear(),
        },
      });

      this.logger.log(`OTP код отправлен на ${email}`);
      return true;

    } catch (error) {
      this.logger.error(`Ошибка отправки OTP: ${error.message}`);
      return false;
    }
  }

  /**
   * Отправка тестового письма
   */
  async sendTestEmail(to: string): Promise<boolean> {
    try {
      this.logger.log(`Отправка тестового письма на ${to}`);
      
      const result = await this.mailerService.sendMail({
        to,
        subject: 'Тестовое письмо',
        text: 'Это тестовое письмо отправленное из NestJS приложения в Docker',
        html: `
          <h1>Тестовое письмо</h1>
          <p>Это тестовое письмо отправленное из NestJS приложения в Docker</p>
          <p>Время: ${new Date().toLocaleString()}</p>
        `,
      });

      this.logger.log(`Письмо отправлено успешно. ID: ${result.messageId}`);
      return true;
      
    } catch (error) {
      this.logger.error(`Ошибка отправки письма: ${error.message}`);
      this.logger.error(error);
      return false;
    }
  }

  /**
   * Отправка письма с шаблоном
   */
  async sendTemplateEmail(
    to: string, 
    subject: string, 
    template: string, 
    context: any
  ): Promise<boolean> {
    try {
      this.logger.log(`Отправка письма "${subject}" на ${to}`);
      
      await this.mailerService.sendMail({
        to,
        subject,
        template, // имя файла шаблона без расширения
        context,  // данные для шаблона
      });

      this.logger.log(`Письмо "${subject}" отправлено успешно`);
      return true;
      
    } catch (error) {
      this.logger.error(`Ошибка отправки письма: ${error.message}`);
      return false;
    }
  }

  /**
   * Отправка письма с подтверждением регистрации
   */
  async sendRegistrationEmail(to: string, username: string, confirmationLink: string): Promise<boolean> {
    return this.sendTemplateEmail(
      to,
      'Добро пожаловать!',
      'registration', // templates/registration.hbs
      {
        username,
        confirmationLink,
        year: new Date().getFullYear(),
      }
    );
  }

  /**
   * Отправка письма для сброса пароля
   */
  async sendPasswordResetEmail(to: string, resetLink: string): Promise<boolean> {
    return this.sendTemplateEmail(
      to,
      'Сброс пароля',
      'password-reset', // templates/password-reset.hbs
      {
        resetLink,
        year: new Date().getFullYear(),
      }
    );
  }
}