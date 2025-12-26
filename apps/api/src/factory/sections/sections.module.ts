import { Module } from '@nestjs/common';
import { SectionsService } from './sections.service';
import { SectionsController } from './sections.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SuperAdminsModule } from 'src/core/super-admins/super-admins.module';
import { Section, SectionSchema } from './entities/section.entity';

@Module({
  imports: [
        MongooseModule.forFeature(
          [{ name: Section.name, schema: SectionSchema }],
          'core',
        ),
        SuperAdminsModule,
      ],
  controllers: [SectionsController],
  providers: [SectionsService],
})
export class SectionsModule {}