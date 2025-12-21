import { Global, Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Client, ClientSchema } from './entities/client.entity';
import { SuperAdminsModule } from '../super-admins/super-admins.module'
import { ClientGuard } from './client.guard';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Client.name, schema: ClientSchema }],
      'core',
    ),
    SuperAdminsModule,
  ],
  controllers: [ClientsController],
  providers: [ClientsService, ClientGuard],
  exports: [ClientsService, MongooseModule],
})
export class ClientsModule {}
