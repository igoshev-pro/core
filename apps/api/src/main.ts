import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true, // 🔥 разрешает любой origin
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'x-project-id',
      'Origin',
      'Accept',
    ],
    exposedHeaders: ['ETag'],
    credentials: false, // важно: если true → origin нельзя '*'
    optionsSuccessStatus: 204, // 🔥 для Safari / старых браузеров
  });

  await app.listen(3000);
}
bootstrap();
