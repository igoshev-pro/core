import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './entities/project.entity';
import { Client, ClientSchema } from '../clients/entities/client.entity';
import { Domain, DomainSchema } from '../domains/entities/domain.entity'
import { SiteSchema, SiteSchemaSchema } from './entities/site-schema.entity';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: Project.name, schema: ProjectSchema },
        { name: SiteSchema.name, schema: SiteSchemaSchema },
        { name: Client.name, schema: ClientSchema },
        { name: Domain.name, schema: DomainSchema },
      ],
      'core',
    ),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, ],
  exports: [ProjectsService, MongooseModule],
})
export class ProjectsModule {}
