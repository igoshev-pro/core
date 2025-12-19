import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ProjectService } from '../../feature/project/project.service';
import { TenantDatabaseService } from './tenant-database.service';
import { TenantMongoService } from './tenant-mongo.service';
import { RequestContext } from './request-context';

interface CachedProject {
  project: any;
  expiresAt: number;
  isRefreshing: boolean;
}

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  private cache = new Map<string, CachedProject>();
  private readonly TTL = 1000 * 60 * 5; // 5 минут

  constructor(
    private readonly projectService: ProjectService,
    private readonly tenantDb: TenantDatabaseService,
    private readonly tenantMongo: TenantMongoService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const now = Date.now();

    const hostname = this.extractHostname(req);

    // ✅ 1. Определяем ключ: либо projectId из админки, либо домен
    const projectId = req.headers['x-project-id'] as string | undefined;
    const cacheKey = projectId || hostname;

    // ✅ 2. Проверяем кэш
    let cached = this.cache.get(cacheKey);

    if (!cached) {
      console.log('❌ Cache miss. Fetching project...');
      const project = projectId
        ? await this.projectService.findOne(projectId)
        : await this.projectService.findByDomain(hostname);

      if (!project) {
        console.warn(`🚫 Project not found for host: ${hostname}`);
        throw new ForbiddenException('Project not found');
      }

      await this.warmUpConnections(project);

      cached = { project, expiresAt: now + this.TTL, isRefreshing: false };
      this.cache.set(cacheKey, cached);
    } else if (cached.expiresAt < now && !cached.isRefreshing) {
      // TTL истёк → обновляем проект в фоне
      cached.isRefreshing = true;
      this.refreshProject(cacheKey, projectId, hostname).finally(() => {
        cached!.isRefreshing = false;
      });
    }

    // ✅ Устанавливаем текущий проект в RequestContext
    RequestContext.run(cached.project, next);
  }

  private extractHostname(req: Request): string {
    // Приоритет: X-Forwarded-Host → Origin → Referer → Host → req.hostname
    const rawReferer = req.headers['referer'] as string | undefined;
    const rawOrigin = req.headers['origin'] as string | undefined;
    const rawForwarded = req.headers['x-forwarded-host'] as string | undefined;
    const rawHost = req.headers['host'] as string | undefined;

    if (rawForwarded) return this.normalizeHost(rawForwarded);

    if (rawOrigin) {
      try {
        return new URL(rawOrigin).hostname;
      } catch {
        return this.normalizeHost(rawOrigin);
      }
    }

    if (rawReferer) {
      try {
        return new URL(rawReferer).hostname;
      } catch {
        return this.normalizeHost(rawReferer);
      }
    }

    if (rawHost) return this.normalizeHost(rawHost);

    return req.hostname.toLowerCase();
  }

  private normalizeHost(host: string): string {
    return host
      .toLowerCase()
      .replace(/^https?:\/\//, '') // убираем протокол
      .replace(/:\d+$/, '') // убираем порт
      .replace(/\/.*$/, ''); // убираем путь, если остался
  }

  private async refreshProject(
    cacheKey: string,
    projectId?: string,
    hostname?: string,
  ) {
    try {
      const project = projectId
        ? await this.projectService.findOne(projectId)
        : await this.projectService.findByDomain(hostname!);

      if (project) {
        await this.warmUpConnections(project);
        this.cache.set(cacheKey, {
          project,
          expiresAt: Date.now() + this.TTL,
          isRefreshing: false,
        });
        console.log(`🔄 Project [${cacheKey}] refreshed & warmed up`);
      }
    } catch (err) {
      console.error(`⚠️ Failed to refresh project ${cacheKey}:`, err.message);
    }
  }

  private async warmUpConnections(project: any) {
    if (project.db?.pg) {
      await this.tenantDb.preconnectPg(project);
    }
    if (project.db?.mongo) {
      await this.tenantMongo.preconnectMongo(project);
    }
  }
}
