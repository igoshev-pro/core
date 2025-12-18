import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
// import { TenantMongoService } from 'src/core/tenant/tenant-mongo.service';
// import { FileModule } from '../file/file.module';
import { UserSchemaController } from './user.schema.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from '../project/project.entity';
import { User, UserSchema } from './user.entity';

@Module({
  // imports: [FileModule],
  imports: [
      MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ],
  controllers: [UserController, UserSchemaController],
  providers: [
    // TenantMongoService, 
    UserService
  ],
  exports: [UserService],
})
export class UserModule {}
