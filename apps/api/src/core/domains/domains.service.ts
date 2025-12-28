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
  if (!hostname) return { ok: false, code: "NOT_FOUND" };

  const key = this.key(hostname);

  // 1) Redis cache
  const cached = await this.redis.get(key);
  if (cached) {
    // ✅ Новый формат: JSON
    if (cached.startsWith("{")) {
      try {
        const parsed = JSON.parse(cached) as {
          projectId?: string;
          status?: string;
          i18n?: { locales?: string[]; defaultLocale?: string };
        };

        const projectId = parsed.projectId ?? "";
        const status = parsed.status ?? "active";

        if (!projectId || projectId === "0") return { ok: false, code: "NOT_FOUND" };
        if (status === "disabled") return { ok: false, code: "DISABLED" };

        return {
          ok: true,
          projectId,
          status: status as any,
          i18n: parsed.i18n,
        };
      } catch {
        // если JSON битый — упадём в старый формат ниже
      }
    }

    // ✅ Старый формат: "projectId|status"
    const [projectId, status] = cached.split("|");

    if (!projectId || projectId === "0") return { ok: false, code: "NOT_FOUND" };
    if (status === "disabled") return { ok: false, code: "DISABLED" };

    return { ok: true, projectId, status: (status as any) ?? "active" };
  }

  // 2) DB fallback
  const row = await this.findDomainInDb(hostname);
  if (!row) {
    await this.redis.set(key, "0|not_found", "EX", 30);
    return { ok: false, code: "NOT_FOUND" };
  }

  if (row.status === "disabled") {
    // можно тоже кэшировать disabled, чтобы не долбить БД
    await this.redis.set(
      key,
      JSON.stringify({ projectId: row.projectId, status: row.status }),
      "EX",
      300
    );
    return { ok: false, code: "DISABLED" };
  }

  // 2.1) Подтягиваем i18n проекта
  const project = await this.projectModel
    .findById(row.projectId)
    .select({ i18n: 1 })
    .lean()
    .exec();

  const i18n = project?.i18n;

  // 3) Save cache ✅ (уже с i18n)
  await this.redis.set(
    key,
    JSON.stringify({
      projectId: row.projectId,
      status: row.status,
      i18n,
    }),
    "EX",
    300
  );

  return {
    ok: true,
    projectId: row.projectId,
    status: row.status,
    i18n,
  };
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