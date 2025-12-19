import {
  Global,
  MiddlewareConsumer,
  Module,
  NestModule,
  OnModuleInit,
} from '@nestjs/common';
import { TenantMiddleware } from './tenant.middleware';
import { ProjectModule } from '../../feature/project/project.module';
import { ProjectService } from '../../feature/project/project.service';
import { TenantDatabaseService } from './tenant-database.service';
import { TenantMongoService } from './tenant-mongo.service';

@Global()
@Module({
  imports: [ProjectModule],
  providers: [TenantDatabaseService, TenantMongoService],
  exports: [TenantDatabaseService, TenantMongoService],
})
export class TenantModule implements NestModule, OnModuleInit {
  constructor(
    private readonly projectService: ProjectService,
    private readonly tenantDb: TenantDatabaseService,
    private readonly tenantMongo: TenantMongoService,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*');
  }

  async onModuleInit() {
    console.log('🔄 Warming up tenant connections...');
    const projects = await this.projectService.findAll(); // core база

    for (const project of projects) {
      // Предзагрузка PG
      // if (project.db?.pg) {
      //   await this.tenantDb.preconnectPg(project);
      // }

      // Предзагрузка Mongo
      if (project.db?.mongo) {
        await this.tenantMongo.preconnectMongo(project);
      }
    }

    console.log('✅ Warm-up complete!');
  }
}

// import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
// import { TenantMiddleware } from './tenant.middleware';
// import { ProjectModule } from '../feature/project/project.module';
// import { TenantDatabaseService } from './tenant-database.service';
// import { TenantMongoService } from './tenant-mongo.service';

// @Module({
//   imports: [ProjectModule],
//   providers: [TenantDatabaseService, TenantMongoService],
//   exports: [TenantDatabaseService, TenantMongoService],
// })
// export class TenantModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(TenantMiddleware).forRoutes('*');
//   }
// }
