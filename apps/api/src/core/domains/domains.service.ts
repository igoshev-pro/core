import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { ResolveDomainResponse } from './dto/resolve-domain.dto';
import { REDIS } from 'src/redis/redis.module'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Domain, type DomainDocument } from './entities/domain.entity'
import { DomainDto } from './dto/domain.dto'
import { Project, ProjectDocument } from '../projects/entities/project.entity';

type DomainRow = {
  host: string;
  projectId: string;
  status: 'active' | 'disabled' | 'draft';
};

@Injectable()
export class DomainsService {
  constructor(
    @Inject(REDIS) private readonly redis: Redis,
    @InjectModel(Domain.name, 'core')
    private readonly domainModel: Model<DomainDocument>,
    @InjectModel(Project.name, 'core')
    private readonly projectModel: Model<ProjectDocument>
  ) { }

  private key(hostname: string) {
    return `domain:${hostname}`;
  }

  private normalizeHost(raw: string): string {
    const host = (raw ?? '').split(',')[0].trim().toLowerCase();
    const hostname = host.split(':')[0]; // убрать порт
    // по желанию можно убрать www.
    return hostname.startsWith('www.') ? hostname.slice(4) : hostname;
  }

  async resolve(rawHost: string): Promise<ResolveDomainResponse> {
    const hostname = this.normalizeHost(rawHost);
    if (!hostname) return { ok: false, code: 'NOT_FOUND' };

    // 1) Redis cache
    const cached = await this.redis.get(this.key(hostname));
    if (cached) {
      // формат: "projectId|status"
      const [projectId, status] = cached.split('|');
      if (!projectId) return { ok: false, code: 'NOT_FOUND' };
      if (status === 'disabled') return { ok: false, code: 'DISABLED' };
      return { ok: true, projectId, status: (status as any) ?? 'active' };
    }

    // 2) DB fallback
    const row = await this.findDomainInDb(hostname);
    if (!row) {
      // negative cache, чтобы не долбить БД при неизвестных доменах
      await this.redis.set(this.key(hostname), '0|not_found', 'EX', 30);
      return { ok: false, code: 'NOT_FOUND' };
    }

    // 3) Save cache
    await this.redis.set(this.key(hostname), `${row.projectId}|${row.status}`, 'EX', 300);

    if (row.status === 'disabled') return { ok: false, code: 'DISABLED' };

    // Добавление локализации
    const project = await this.projectModel.findOne(({ _id: row.projectId })).exec()
    if (project?.i18n) {
      return { ok: true, projectId: row.projectId, status: row.status, i18n: project.i18n}
    }

    return { ok: true, projectId: row.projectId, status: row.status };
  }

  // TODO: заменить на реальный запрос
  private findDomainInDb(hostname: string): Promise<DomainRow | null> {
    // пример:
    // return this.prisma.domain.findUnique({ where: { host: hostname }, select: { host:true, projectId:true, status:true }});
    // if (hostname === 'tenant.local') {
    //   return { host: hostname, projectId: 'project-uuid-1', status: 'active' };
    // }

    // @ts-ignore
    return this.domainModel.findOne({ host: hostname }).exec();
  }

  create(data: DomainDto) {
    const newDomain = new this.domainModel(data);
    return newDomain.save();
  }

  findAll(query: Record<string, any>) {
    const { limit } = query;

    const limitValue = Number.parseInt(limit ?? '', 10);

    return this.domainModel
      .find()
      .sort({ createdAt: -1 })
      .limit(Number.isNaN(limitValue) ? 10 : limitValue)
      .exec();
  }

  findOne(id: string) {
    return this.domainModel.findOne({ _id: id }).exec();
  }


  update(id: string, data: DomainDto) {
    return this.domainModel
      .findByIdAndUpdate({ _id: id }, { ...data }, { new: true })
      .lean();
  }

  async remove(id: string) {
    await this.domainModel.deleteOne({ _id: id }).exec()
  }
}