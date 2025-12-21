import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import mongoose, { Connection } from 'mongoose';

type TenantKey = string;

@Injectable()
export class TenantConnectionManager implements OnModuleDestroy {
  private readonly logger = new Logger(TenantConnectionManager.name);

  private readonly connections = new Map<TenantKey, Connection>();

  private readonly connecting = new Map<TenantKey, Promise<Connection>>();

  async getOrCreateConnection(key: TenantKey, uri: string): Promise<Connection> {
    const existing = this.connections.get(key);
    if (existing?.readyState === 1) return existing;

    const inFlight = this.connecting.get(key);
    if (inFlight) return inFlight;

    const promise = this.createConnection(key, uri);
    this.connecting.set(key, promise);

    try {
      const conn = await promise;
      this.connections.set(key, conn);
      return conn;
    } finally {
      this.connecting.delete(key);
    }
  }

  private async createConnection(key: TenantKey, uri: string): Promise<Connection> {
    this.logger.log(`Creating tenant connection: ${key}`);

    const conn = await mongoose.createConnection(uri, {
      // можно добавить настройки:
      // serverSelectionTimeoutMS: 10_000,
      // maxPoolSize: 10,
    }).asPromise();

    conn.on('error', (err) => this.logger.error(`Tenant ${key} error: ${err?.message ?? err}`));
    conn.on('disconnected', () => this.logger.warn(`Tenant ${key} disconnected`));

    return conn;
  }

  async onModuleDestroy() {
    const conns = [...this.connections.values()];
    await Promise.allSettled(conns.map((c) => c.close()));
    this.connections.clear();
    this.connecting.clear();
  }
}
