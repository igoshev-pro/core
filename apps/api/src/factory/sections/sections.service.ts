import { Injectable } from '@nestjs/common';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Section, SectionDocument } from './entities/section.entity';
import { Model } from 'mongoose';

@Injectable()
export class SectionsService {
  constructor(
    @InjectModel(Section.name, 'core')
    private readonly sectionModel: Model<SectionDocument>,
  ) { }

  async create(data: CreateSectionDto) {
    const newSection = new this.sectionModel(data);
    return newSection.save();
  }s
  findAll(query: Record<string, any>) {
    const { limit, offset } = query;

    const limitValue = Number.parseInt(limit ?? '', 10);

    return this.sectionModel
      .find()
      .sort({ sortOrder: 1 })
      .skip(offset)
      .populate('widgets')
      .limit(Number.isNaN(limitValue) ? 10 : limitValue)
      .exec();
  }

  findOne(id: string) {
    return this.sectionModel.findOne({ _id: id }).populate('widgets').exec();
  }

  findByKey(key: string) {
    return this.sectionModel.findOne({ key }).select('propsSchema').lean().exec();
  }

  update(id: string, data: UpdateSectionDto) {
    return this.sectionModel
      .findByIdAndUpdate({ _id: id }, { ...data }, { new: true })
      .lean();
  }

  async remove(id: string) {
    await this.sectionModel.deleteOne({ _id: id }).exec()
  }
}
