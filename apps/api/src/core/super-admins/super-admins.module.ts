import { Module } from '@nestjs/common';
import { SuperAdminsService } from './super-admins.service';
import { SuperAdminsController } from './super-admins.controller';
import { MongooseModule } from '@nestjs/mongoose'
import { SuperAdmin, SuperAdminSchema } from './entities/super-admin.entity'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SuperAdmin.name, schema: SuperAdminSchema }]),
  ],
  controllers: [SuperAdminsController],
  providers: [SuperAdminsService],
})
export class AdminsModule {}
