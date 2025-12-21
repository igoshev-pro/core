import {
  DynamicModule,
  Module,
  Provider,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Connection, Model, Schema } from 'mongoose';
import { TenantConnectionManager } from './tenant-connection.manager';
import {
  TENANT_CONNECTION,
  TENANT_PROJECT_ID,
  getTenantModelToken,
} from './tenant.tokens';
import { ProjectsModule } from 'src/core/projects/projects.module';
import { ProjectsService } from 'src/core/projects/projects.service';

type ReqWithTenant = Request & {
  projectId?: string;
  headers?: Record<string, unknown>;
  [TENANT_PROJECT_ID]?: string;
};

export interface TenantModelDef {
  name: string;
  schema: Schema;
  collection?: string;
}

@Module({
  imports: [ProjectsModule],
  providers: [TenantConnectionManager],
  exports: [TenantConnectionManager],
})
export class TenantDatabaseModule {
  /**
   * Request-scoped tenant connection
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
        const headerProjectId =
          (req.headers?.['x-project-id'] as string | undefined) ?? undefined;

        const projectId =
          req?.[TENANT_PROJECT_ID] ??
          req?.projectId ??
          headerProjectId;

        if (!projectId) {
          throw new UnauthorizedException('Missing x-project-id');
        }

        const db = await projectsService.getDbConfigOrThrow(projectId);
        return manager.getOrCreateConnection(projectId, db.uri);
      },
    };

    return {
      module: TenantDatabaseModule,
      imports: [ProjectsModule],
      providers: [TenantConnectionManager, tenantConnectionProvider],
      exports: [TenantConnectionManager, tenantConnectionProvider],
    };
  }

  /**
   * Tenant models
   * 🔥 forFeature САМ подтягивает forRoot
   */
  static forFeature(models: TenantModelDef[]): DynamicModule {
    const modelProviders: Provider[] = models.map((m) => ({
      provide: getTenantModelToken(m.name),
      inject: [TENANT_CONNECTION],
      useFactory: (conn: Connection): Model<any> =>
        conn.model(m.name, m.schema, m.collection),
    }));

    return {
      module: TenantDatabaseModule,
      imports: [
        // 🔥 КЛЮЧЕВОЕ МЕСТО
        TenantDatabaseModule.forRoot(),
      ],
      providers: modelProviders,
      exports: modelProviders,
    };
  }
}
