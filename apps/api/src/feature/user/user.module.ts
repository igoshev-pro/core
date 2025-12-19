import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TenantMongoService } from 'src/core/tenant/tenant-mongo.service';
import { FileModule } from '../file/file.module';
import { UserSchemaController } from './user.schema.controller';

@Module({
  imports: [FileModule],
  controllers: [UserController, UserSchemaController],
  providers: [TenantMongoService, UserService],
  exports: [UserService],
})
export class UserModule {}
