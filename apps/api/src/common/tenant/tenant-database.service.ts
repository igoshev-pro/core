import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { RequestContext } from './request-context';

@Injectable()
export class TenantDatabaseService {
  private readonly logger = new Logger(TenantDatabaseService.name);
  private readonly pgConnections = new Map<string, DataSource>();

  async getPostgresConnection(): Promise<DataSource | null> {
    const tenant = RequestContext.getTenant();
    if (!tenant?.db?.pg) return null;

    const dbName = tenant.db.pg.name;
    if (this.pgConnections.has(dbName)) {
      return this.pgConnections.get(dbName)!;
    }

    this.logger.log(`Создаём подключение Postgres для ${dbName}`);
    const ds = new DataSource({
      type: 'postgres',
      host: tenant.db.pg.host,
      port: tenant.db.pg.port,
      username: tenant.db.pg.user,
      password: tenant.db.pg.pass,
      database: dbName,
      entities: tenant.db.pg.entities,
      synchronize: false,
    });

    await ds.initialize();
    this.pgConnections.set(dbName, ds);
    return ds;
  }

  async preconnectPg(project: any) {
    const dbName = project.db.pg.name;
    if (this.pgConnections.has(dbName)) return;

    this.logger.log(`Preconnecting Postgres for ${dbName}`);
    const ds = new DataSource({
      type: 'postgres',
      host: project.db.pg.host,
      port: project.db.pg.port,
      username: project.db.pg.user,
      password: project.db.pg.pass,
      database: dbName,
      entities: project.db.pg.entities,
      synchronize: false,
    });

    await ds.initialize();
    this.pgConnections.set(dbName, ds);
  }
}

// @Injectable()
// export class UserService {
//   constructor(
//     private readonly tenantDb: TenantDatabaseService,
//     private readonly tenantMongo: TenantMongoService,
//   ) {}

//   async getUsersPg() {
//     const pg = await this.tenantDb.getPostgresConnection();
//     return pg?.getRepository(UserEntity).find();
//   }

//   async getUsersMongo() {
//     const mongo = await this.tenantMongo.getConnection();
//     return mongo?.collection('users').find().toArray();
//   }
// }
