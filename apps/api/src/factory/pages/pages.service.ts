import { Injectable } from '@nestjs/common';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Page, PageDocument } from './entities/page.entity';
import { Model } from 'mongoose';

@Injectable()
export class PagesService {
  constructor(
    @InjectModel(Page.name, 'core')
    private readonly pageModel: Model<PageDocument>,
  ) { }

  async create(data: CreatePageDto) {
    const newPage = new this.pageModel(data);
    return newPage.save();
  }

  findAll(query: Record<string, any>) {
    const { limit, offset } = query;

    const limitValue = Number.parseInt(limit ?? '', 10);

    return this.pageModel
      .find()
      .sort({ sortOrder: 1 })
      .skip(offset)
      .populate({
        path: "blocks.ref",
      })
      .limit(Number.isNaN(limitValue) ? 10 : limitValue)
      .exec();
  }

  findOne(id: string) {
    return this.pageModel.findOne({ _id: id }).populate({
      path: "blocks.ref",
    }).exec();
  }

  update(id: string, data: UpdatePageDto) {
    return this.pageModel
      .findByIdAndUpdate({ _id: id }, { ...data }, { new: true })
      .lean();
  }

  async remove(id: string) {
    await this.pageModel.deleteOne({ _id: id }).exec()
  }
}