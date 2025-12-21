import { Module } from '@nestjs/common';
import { User, UserSchema } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TenantDatabaseModule } from 'src/tenant/tenant-database.module';


@Module({
  imports: [
    TenantDatabaseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
