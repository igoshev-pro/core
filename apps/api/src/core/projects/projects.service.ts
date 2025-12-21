import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, type ProjectDocument } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name, 'core')
    private readonly projectModel: Model<ProjectDocument>,
  ) {}

  generateReadableRandomDomain() {
    const adjectives = ['quick', 'bright', 'clever', 'fast', 'smart', 'happy', 'sunny'];
    const nouns = ['fox', 'bear', 'wolf', 'eagle', 'hawk', 'lion', 'tiger'];
    
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const number = Math.floor(Math.random() * 99);
    
    return `${adj}-${noun}${number}-demo.igoshev.pro`;
}

  create(data: CreateProjectDto) {
    if (!data?.db?.mongo?.uri && data?.db?.mongo?.name)
      data.db.mongo.uri = `${process.env.MONGO_URI_FIRST_PART}${data.db.mongo.name.toLowerCase()}${process.env.MONGO_URI_LAST_PART}`;

    data.domainTech = this.generateReadableRandomDomain()

    const newProject = new this.projectModel(data);
    return newProject.save();
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

  remove(id: string) {
    this.projectModel.deleteOne({ _id: id }).exec();
  }
}
