import { Global, Module } from '@nestjs/common';
import Redis from 'ioredis';

export const REDIS = Symbol('REDIS');

@Global()
@Module({
  providers: [
    {
      provide: REDIS,
      useFactory: () => {
        const url = process.env.REDIS_URL ?? 'redis://localhost:6379';
        const client = new Redis(url, {
          maxRetriesPerRequest: 2,
          enableReadyCheck: true,
        });

        client.on('error', (err) => console.error('[redis] error', err));
        client.on('connect', () => console.log('[redis] connected'));

        return client;
      },
    },
  ],
  exports: [REDIS],
})
export class RedisModule {}