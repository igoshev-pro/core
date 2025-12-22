import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, type ProjectDocument } from './entities/project.entity';
import { Client, ClientDocument } from '../clients/entities/client.entity';
import { ProjectStatus } from './project.enum';
import { Domain, type DomainDocument } from '../domains/entities/domain.entity'

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

  generateReadableRandomDomain() {
    const adjectives = [
      'quick',
      'bright',
      'clever',
      'fast',
      'smart',
      'happy',
      'sunny',
      'brave',
      'calm',
      'cool',
      'kind',
      'sharp',
      'strong',
      'swift',
      'silent',
      'loud',
      'gentle',
      'bold',
      'proud',
      'fresh',
      'wise',
      'wild',
      'free',
      'playful',
      'fierce',
      'friendly',
      'curious',
      'eager',
      'alert',
      'active',
      'agile',
      'busy',
      'cheerful',
      'charming',
      'confident',
      'creative',
      'daring',
      'dynamic',
      'energetic',
      'faithful',
      'fearless',
      'focused',
      'funny',
      'graceful',
      'helpful',
      'honest',
      'humble',
      'inventive',
      'jolly',
      'keen',
      'lively',
      'loyal',
      'mighty',
      'modern',
      'neat',
      'noble',
      'optimistic',
      'patient',
      'peaceful',
      'powerful',
      'practical',
      'precise',
      'quiet',
      'rapid',
      'reliable',
      'resilient',
      'robust',
      'serene',
      'sincere',
      'skillful',
      'steady',
      'thoughtful',
      'tough',
      'trusty',
      'upbeat',
      'vivid',
      'warm',
      'witty',
      'zesty',
    ];

    const nouns = [
      'fox',
      'bear',
      'wolf',
      'eagle',
      'hawk',
      'lion',
      'tiger',
      'panther',
      'leopard',
      'cheetah',
      'falcon',
      'raven',
      'owl',
      'shark',
      'whale',
      'dolphin',
      'otter',
      'seal',
      'horse',
      'stallion',
      'mustang',
      'bison',
      'buffalo',
      'deer',
      'elk',
      'moose',
      'boar',
      'ram',
      'goat',
      'sheep',
      'camel',
      'llama',
      'alpaca',
      'monkey',
      'ape',
      'gorilla',
      'baboon',
      'panda',
      'koala',
      'kangaroo',
      'wallaby',
      'badger',
      'beaver',
      'weasel',
      'marten',
      'squirrel',
      'chipmunk',
      'rabbit',
      'hare',
      'hedgehog',
      'porcupine',
      'skunk',
      'lynx',
      'bobcat',
      'cougar',
      'jaguar',
      'crocodile',
      'alligator',
      'lizard',
      'gecko',
      'python',
      'viper',
      'cobra',
      'turtle',
      'tortoise',
      'frog',
      'toad',
      'newt',
      'sparrow',
      'robin',
      'crow',
      'magpie',
      'swan',
      'goose',
      'heron',
      'crane',
      'stork',
      'pelican',
      'antelope',
      'gazelle',
      'oryx',
    ];

    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomString = Math.random().toString(36).slice(2, 7);

    return `${adj}-${noun}-${randomString}.igoshev.pro`;
  }

  async create(data: CreateProjectDto) {
    if (!data?.db?.mongo?.uri && data?.db?.mongo?.name) {
      data.db.mongo.uri =
        `${process.env.MONGO_URI_FIRST_PART}` +
        `${data.db.mongo.name.toLowerCase()}` +
        `${process.env.MONGO_URI_LAST_PART}`;
    }

    data.domainTech = this.generateReadableRandomDomain();

    const project = await new this.projectModel(data);
    const savedProject = await project.save();

    if (!savedProject?._id) {
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    await this.clientModel.findOneAndUpdate(
      { _id: data.owner },
      { $addToSet: { projects: savedProject._id } },
      { new: true },
    );

    const newDomain = new this.domainModel({
      host: data.domainTech,
      projectId: savedProject._id.toString(),
      status: ProjectStatus.ACTIVE,
    });
    newDomain.save();

    return savedProject;
  }

  async getDbConfigOrThrow(projectId: string) {
    const project = await this.projectModel
      .findOne({ _id: projectId })
      .lean()
      .exec();

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
      .sort({ createdAt: -1 })
      .limit(Number.isNaN(limitValue) ? 10 : limitValue)
      .exec();
  }

  findOne(id: string) {
    return this.projectModel.findOne({ _id: id }).exec();
  }

  async update(id: string, data: UpdateProjectDto) {
    // Получаем старый проект перед обновлением
    const oldProject = await this.projectModel.findById(id).lean();
    if (!oldProject) {
      throw new NotFoundException('Проект не найден');
    }

    // Выполняем обновление
    const updatedProject = await this.projectModel
      .findOneAndUpdate({ _id: id }, { ...data }, { new: true })
      .lean();

    // Формируем объект со старыми значениями для отслеживаемых полей
    const oldFields: Record<string, any> = {};
    for (const key of ['preview', 'logo']) {
      oldFields[`_${key}`] = oldProject[key];
    }

    return { ...updatedProject, ...oldFields };
  }

  async remove(id: string) {
    const project = await this.projectModel.findOne({ _id: id }).lean();

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
}
