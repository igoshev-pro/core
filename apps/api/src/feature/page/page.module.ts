import { Module } from '@nestjs/common';
import { PageService } from './page.service';
import { PageController } from './page.controller';
import { PageSchemaController } from './page.schema.controller';
import { FileModule } from '../file/file.module';
import { TenantMongoService } from 'src/core/tenant/tenant-mongo.service';

@Module({
  imports: [FileModule],
  controllers: [PageController, PageSchemaController],
  providers: [TenantMongoService, PageService],
  exports: [PageService],
})
export class PageModule {}
