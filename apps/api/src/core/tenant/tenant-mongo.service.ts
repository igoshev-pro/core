import { Injectable, Logger } from '@nestjs/common';
import { createConnection, Connection, Model, Schema } from 'mongoose';
import { RequestContext } from './request-context';

@Injectable()
export class TenantMongoService {
  private readonly logger = new Logger(TenantMongoService.name);
  private readonly mongoConnections = new Map<string, Connection>();
  private readonly modelCache = new Map<string, Map<string, Model<any>>>();

  async getConnection(): Promise<Connection | null> {
    const tenant = RequestContext.getTenant();
    if (!tenant?.db?.mongo) return null;

    const dbName = tenant.db.mongo.name;
    if (this.mongoConnections.has(dbName)) {
      return this.mongoConnections.get(dbName)!;
    }

    this.logger.log(`Создаём подключение MongoDB для ${dbName}`);
    const conn = await createConnection(tenant.db.mongo.uri, {
      dbName,
    }).asPromise();
    this.mongoConnections.set(dbName, conn);
    this.modelCache.set(dbName, new Map()); // создаём кэш моделей для этого tenant
    return conn;
  }

  async getModel<T = any>(name: string, schema: Schema): Promise<Model<T>> {
    const conn = await this.getConnection();
    if (!conn) throw new Error('Нет подключения к Mongo для tenant');

    const dbName = conn.name;
    const tenantModels = this.modelCache.get(dbName)!;

    if (!tenantModels.has(name)) {
      this.logger.log(`Регистрируем модель ${name} для ${dbName}`);
      tenantModels.set(name, conn.model<T>(name, schema));
    }

    return tenantModels.get(name)!;
  }

  async preconnectMongo(project: any) {
    const dbName = project.db.mongo.name;
    if (this.mongoConnections.has(dbName)) return;

    this.logger.log(`Preconnecting MongoDB for ${dbName}`);
    const conn = await createConnection(project.db.mongo.uri, {
      dbName,
    }).asPromise();
    this.mongoConnections.set(dbName, conn);
    this.modelCache.set(dbName, new Map());
  }
}
