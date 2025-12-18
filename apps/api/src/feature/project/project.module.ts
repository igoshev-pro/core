import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './project.entity';
import { ProjectSchemaController } from './project.schema.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
  ],
  controllers: [ProjectController, ProjectSchemaController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
