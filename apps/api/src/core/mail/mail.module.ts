import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { MailService } from './mail.service';
import { handlebarsHelpers } from './handlebars-helpers';
// const fs = require('fs');

// function getTemplatesPath() {
//   const isProd = process.env.NODE_ENV === 'production';
//   const isDocker = process.env.DOCKER === 'true' || fs.existsSync('/.dockerenv');
  
//   if (isProd || isDocker) {
//     // В Docker/prod - используем dist
//     return join(process.cwd(), 'dist', 'core', 'mail', 'templates');
//   } else {
//     // В dev - используем src
//     return join(process.cwd(), 'src', 'core', 'mail', 'templates');
//   }
// }

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async () => {
        // Для IONOS используем эти настройки
        return {
          transport: {
            host: 'smtp.ionos.de',
            port: 587, // Порты на выбор: 587 (STARTTLS) или 465 (SSL)
            secure: false, // false для 587, true для 465
            requireTLS: true, // Важно для IONOS
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
            // Критически важные таймауты для Docker
            connectionTimeout: 60000, // 60 секунд
            greetingTimeout: 30000,   // 30 секунд
            socketTimeout: 60000,     // 60 секунд
            dnsTimeout: 10000,        // 10 секунд для DNS
            
            // Отключаем IPv6 если есть проблемы
            family: 4, // Только IPv4
            
            // Настройки TLS
            tls: {
              servername: 'smtp.ionos.de',
              rejectUnauthorized: false, // Принимаем самоподписанные сертификаты
            },
            
            // Логирование для отладки
            debug: process.env.NODE_ENV !== 'production',
            logger: process.env.NODE_ENV !== 'production',
          },
          defaults: {
            from: `"No Reply" <${process.env.SMTP_FROM}>`,
          },
          template: {
            dir: join(process.cwd(), 'dist', 'core', 'mail', 'templates'),
            adapter: new HandlebarsAdapter(handlebarsHelpers),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}