import { Module } from '@nestjs/common';
import { DomainsController } from './domains.controller';
import { DomainsService } from './domains.service';
import { MongooseModule } from '@nestjs/mongoose'
import { Domain } from 'domain'
import { DomainSchema } from './entities/domain.entity'
import { SuperAdminGuard } from '../auth/guards/super-admin.guard'

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Domain.name, schema: DomainSchema }],
      'core',
    ),
  ],
  controllers: [DomainsController],
  providers: [DomainsService],
  exports: [DomainsService, MongooseModule],
})
export class DomainsModule {}
