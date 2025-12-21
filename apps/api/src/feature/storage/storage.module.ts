import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';
import { s3ClientProvider } from './s3/s3.client.provider';

@Module({
  imports: [ConfigModule],
  controllers: [StorageController],
  providers: [s3ClientProvider, StorageService],
  exports: [StorageService],
})
export class StorageModule {}
