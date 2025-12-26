import { Module } from '@nestjs/common';
import { PagesService } from './pages.service';
import { PagesController } from './pages.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SuperAdminsModule } from 'src/core/super-admins/super-admins.module';
import { Page, PageSchema } from './entities/page.entity';

@Module({
  imports: [
        MongooseModule.forFeature(
          [{ name: Page.name, schema: PageSchema }],
          'core',
        ),
        SuperAdminsModule,
      ],
  controllers: [PagesController],
  providers: [PagesService],
})
export class PagesModule {}