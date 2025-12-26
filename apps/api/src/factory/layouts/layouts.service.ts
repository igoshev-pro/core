import { Injectable } from '@nestjs/common';
import { CreateLayoutDto } from './dto/create-layout.dto';
import { UpdateLayoutDto } from './dto/update-layout.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Layout, LayoutDocument } from './entities/layout.entity';
import { Model } from 'mongoose';

@Injectable()
export class LayoutsService {
  constructor(
    @InjectModel(Layout.name, 'core')
    private readonly layoutModel: Model<LayoutDocument>,
  ) { }

  async create(data: CreateLayoutDto) {
    const newLayout = new this.layoutModel(data);
    return newLayout.save();
  }

  findAll(query: Record<string, any>) {
    const { limit, offset } = query;

    const limitValue = Number.parseInt(limit ?? '', 10);

    return this.layoutModel
      .find()
      .sort({ sortOrder: 1 })
      .skip(offset)
      .populate({ path: "slots.ref" })
      .limit(Number.isNaN(limitValue) ? 10 : limitValue)
      .exec();
  }

  findOne(id: string) {
    return this.layoutModel.findOne({ _id: id }).populate({
      path: "slots.ref",
    }).exec();
  }

  update(id: string, data: UpdateLayoutDto) {
    return this.layoutModel
      .findByIdAndUpdate({ _id: id }, { ...data }, { new: true })
      .lean();
  }

  async remove(id: string) {
    await this.layoutModel.deleteOne({ _id: id }).exec()
  }
}
