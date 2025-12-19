import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './project.entity';
import { InjectModel } from '@nestjs/mongoose';
import { CreateProjectDto, type UpdateProjectDto } from './project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>,
  ) {}

  create(data: CreateProjectDto) {
    if (!data?.db?.mongo?.uri && data?.db?.mongo?.name)
      data.db.mongo.uri = `${process.env.MONGO_URI_FIRST_PART}${data.db.mongo.name}${process.env.MONGO_URI_LAST_PART}`;

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

  async findByDomain(domain: string) {
    return await this.projectModel.findOne({ url: domain }).exec();
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
    return this.projectModel.deleteOne({ _id: id }).exec();
  }
}
