import { Module } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { TemplatesController } from './templates.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Template, TemplateSchema } from './entities/template.entity';
import { SuperAdminsModule } from 'src/core/super-admins/super-admins.module';

@Module({
  imports: [
      MongooseModule.forFeature(
        [{ name: Template.name, schema: TemplateSchema }],
        'core',
      ),
      SuperAdminsModule,
    ],
  controllers: [TemplatesController],
  providers: [TemplatesService],
})
export class TemplatesModule {}
