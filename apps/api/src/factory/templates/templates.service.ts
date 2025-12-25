import { Injectable } from '@nestjs/common';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Template, TemplateDocument } from './entities/template.entity';
import { Model } from 'mongoose';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectModel(Template.name, 'core')
    private readonly templateModel: Model<TemplateDocument>,
  ) { }

  async create(data: CreateTemplateDto) {
    const newClient = new this.templateModel(data);
    return newClient.save();
  }

  findAll(query: Record<string, any>) {
    const { limit, offset } = query;

    const limitValue = Number.parseInt(limit ?? '', 10);

    return this.templateModel
      .find()
      .sort({ sortOrder: 1 })
      .skip(offset)
      .limit(Number.isNaN(limitValue) ? 10 : limitValue)
      .exec();
  }

  findOne(id: string) {
    return this.templateModel.findOne({ _id: id }).exec();
  }

  update(id: string, data: UpdateTemplateDto) {
    return this.templateModel
      .findByIdAndUpdate({ _id: id }, { ...data }, { new: true })
      .lean();
  }

  async remove(id: string) {
    await this.templateModel.deleteOne({ _id: id }).exec()
  }
}
