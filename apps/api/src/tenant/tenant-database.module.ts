import { DynamicModule, Global, Module, Provider, Scope, UnauthorizedException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Connection, Model, Schema } from 'mongoose';
import { TenantConnectionManager } from './tenant-connection.manager';
import { TENANT_CONNECTION, TENANT_PROJECT_ID, getTenantModelToken } from './tenant.tokens';
import { ProjectsModule } from 'src/core/projects/projects.module';
import { ProjectsService } from 'src/core/projects/projects.service';

type ReqWithTenant = Request & { [TENANT_PROJECT_ID]?: string };

export interface TenantModelDef {
  name: string;
  schema: Schema;
  collection?: string;
}

@Global()
@Module({
  imports: [ProjectsModule],
  providers: [TenantConnectionManager],
  exports: [TenantConnectionManager],
})
export class TenantDatabaseModule {
  /**
   * Создаёт request-scoped tenant connection провайдер
   */
  static forRoot(): DynamicModule {
    const tenantConnectionProvider: Provider = {
      provide: TENANT_CONNECTION,
      scope: Scope.REQUEST,
      inject: [REQUEST, ProjectsService, TenantConnectionManager],
      useFactory: async (
        req: ReqWithTenant,
        projectsService: ProjectsService,
        manager: TenantConnectionManager,
      ): Promise<Connection> => {
        const projectId = req?.[TENANT_PROJECT_ID];

        if (!projectId) {
          // если у тебя есть публичные эндпоинты без tenant — можешь возвращать null
          // но обычно лучше явно требовать projectId для tenant-роутов
          throw new UnauthorizedException('Missing x-project-id');
        }

        const db = await projectsService.getDbConfigOrThrow(projectId);
        // key можно сделать projectId (надёжно)
        return manager.getOrCreateConnection(projectId, db.uri);
      },
    };

    return {
      module: TenantDatabaseModule,
      providers: [tenantConnectionProvider],
      exports: [tenantConnectionProvider, TenantConnectionManager],
    };
  }

  /**
   * Регистрирует модели в tenant connection (как MongooseModule.forFeature, но динамично)
   */
  static forFeature(models: TenantModelDef[]): DynamicModule {
    const providers: Provider[] = models.map((m) => ({
      provide: getTenantModelToken(m.name),
      inject: [TENANT_CONNECTION],
      useFactory: (conn: Connection): Model<any> => {
        // Важно: model name должен совпадать со схемой
        // collection можно зафиксировать, если нужно
        return conn.model(m.name, m.schema, m.collection);
      },
    }));

    return {
      module: TenantDatabaseModule,
      imports: [ProjectsModule],
      providers,
      exports: providers,
      global: true
    };
  }
}
