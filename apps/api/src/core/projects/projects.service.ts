import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

import { Project, type ProjectDocument } from './entities/project.entity';
import { Client, type ClientDocument } from '../clients/entities/client.entity';
import { Domain, type DomainDocument } from '../domains/entities/domain.entity';

import { ProjectStatus } from './project.enum';
import { Mode } from './projects.controller';

import { SiteSchemaSection } from './entities/site-schema.entity';
import { generateReadableRandomDomain } from 'src/common/utils/generateReadableRandomDomain';

const DEFAULT_SCHEMA_BY_MODE: Record<Mode, SiteSchemaSection> = {
  admin: {
    version: '1.0.0',
    layout: { _id: 'l-admin', type: 'layout', layoutKey: 'admin.shell', slots: {} },
    pages: [
      {
        _id: 'p-admin',
        name: 'Admin',
        path: '/admin',
        kind: 'static',
        access: {},
        blocks: [],
      },
    ],
  },
  login: {
    version: '1.0.0',
    layout: { _id: 'l-login', type: 'layout', layoutKey: 'auth.default', slots: {} },
    pages: [
      {
        _id: 'p-login',
        name: 'Login',
        path: '/login',
        kind: 'static',
        access: {},
        blocks: [],
      },
    ],
  },
  public: {
    version: '1.0.0',
    layout: { _id: 'l-public', type: 'layout', layoutKey: 'public.default', slots: {} },
    pages: [
      {
        _id: 'home',
        name: 'Home',
        path: '/',
        kind: 'static',
        access: {},
        blocks: [],
      },
    ],
  },
} as const;

function pickTemplateId(project: any, mode: Mode): string {
  if (mode === 'admin') return project.template?.admin ?? 'pro';
  if (mode === 'login') return project.template?.auth ?? 'auth-default';
  return project.template?.public ?? 'landing-classic';
}

function pickThemeId(project: any, mode: Mode): string {
  if (mode === 'admin') return project.theme?.admin ?? 'default-light';
  if (mode === 'login') return project.theme?.auth ?? 'default-light';
  return project.theme?.public ?? 'default-light';
}

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name, 'core')
    private readonly projectModel: Model<ProjectDocument>,
    @InjectModel(Client.name, 'core')
    private readonly clientModel: Model<ClientDocument>,
    @InjectModel(Domain.name, 'core')
    private readonly domainModel: Model<DomainDocument>,
  ) {}

  async create(data: CreateProjectDto) {
    if (!data?.db?.mongo?.uri && data?.db?.mongo?.name) {
      data.db.mongo.uri =
        `${process.env.MONGO_URI_FIRST_PART}` +
        `${data.db.mongo.name.toLowerCase()}` +
        `${process.env.MONGO_URI_LAST_PART}`;
    }

    data.domainTech = generateReadableRandomDomain();

    const project = new this.projectModel(data);
    const savedProject = await project.save();

    if (!savedProject?._id) {
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const newDomain = new this.domainModel({
      host: data.domainTech,
      projectId: savedProject._id.toString(),
      status: ProjectStatus.ACTIVE,
    });

    await newDomain.save();

    await this.clientModel.findOneAndUpdate(
      { _id: data.owner },
      { $addToSet: { projects: savedProject._id } },
      { new: true },
    );

    return savedProject;
  }

  async getDbConfigOrThrow(projectId: string) {
    const project = await this.projectModel.findOne({ _id: projectId }).lean().exec();

    if (!project) throw new NotFoundException('Project not found');

    if (!project.db?.mongo?.uri) {
      throw new NotFoundException('Project DB config is missing');
    }

    return project.db.mongo;
  }

  findAll(query: Record<string, string> = {}) {
    const { owner, limit } = query;

    const filter: Record<string, any> = {};
    if (owner) filter.owner = owner;

    const limitValue = Number.parseInt(limit ?? '', 10);

    return this.projectModel
      .find(filter)
      .sort({ sortOrder: 1 })
      .populate('owner')
      .limit(Number.isNaN(limitValue) ? 10 : limitValue)
      .exec();
  }

  findOne(id: string) {
    return this.projectModel.findOne({ _id: id }).populate('owner').exec();
  }

  async update(id: string, data: UpdateProjectDto) {
    const oldProject = await this.projectModel.findById(id).lean().exec();
    if (!oldProject) throw new NotFoundException('Проект не найден');

    const updatedProject = await this.projectModel
      .findOneAndUpdate({ _id: id }, { ...data }, { new: true })
      .lean()
      .exec();

    const oldFields: Record<string, any> = {};
    for (const key of ['preview', 'logo']) {
      oldFields[`_${key}`] = (oldProject as any)[key];
    }

    return { ...updatedProject, ...oldFields };
  }

  async remove(id: string) {
    const project = await this.projectModel.findOne({ _id: id }).lean().exec();

    if (!project) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    }

    await this.projectModel.deleteOne({ _id: id }).exec();

    await this.clientModel.findByIdAndUpdate(project.owner, {
      $pull: { projects: project._id },
    });

    return { success: true };
  }

  async removeManyByIds(projectIds: string[]) {
    if (!projectIds.length) return;

    await this.projectModel
      .deleteMany({
        _id: { $in: projectIds },
      })
      .exec();
  }

  async getRuntime(projectId: string, mode: Mode) {
    const project = await this.projectModel
      .findById(projectId)
      .select({
        _id: 1,
        template: 1,
        theme: 1,
        seoDefaults: 1,
      })
      .lean()
      .exec();

    if (!project) throw new NotFoundException('Project not found');

    return {
      projectId: project._id.toString(),
      templateId: pickTemplateId(project, mode),
      themeId: pickThemeId(project, mode),
      seoDefaults: project.seoDefaults ?? {},
    };
  }

  /**
   * Теперь Project.site = ObjectId ref 'SiteSchema'
   * Поэтому берём site через populate и возвращаем нужную секцию.
   */
  async getSchema(projectId: string, mode: Mode) {
    const project = await this.projectModel
      .findById(projectId)
      .select({ _id: 1, site: 1 })
      .populate({
        path: 'site',
        select: { public: 1, admin: 1, login: 1 },
        options: { lean: true },
      })
      .lean()
      .exec();

    if (!project) throw new NotFoundException('Project not found');

    const site = project.site as any | null;

    const section: SiteSchemaSection | undefined =
      mode === 'admin'
        ? site?.admin
        : mode === 'login'
          ? site?.login
          : site?.public;

    return section ?? DEFAULT_SCHEMA_BY_MODE[mode];
  }

  async search(projectId: string, q: string) {
    const query: any = { projectId };

    if (q?.trim()) {
      query.$text = { $search: q.trim() };
    }

    return this.projectModel
      .find(query, q?.trim() ? { score: { $meta: 'textScore' } } : undefined)
      .sort(q?.trim() ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
      .limit(50);
  }
}
