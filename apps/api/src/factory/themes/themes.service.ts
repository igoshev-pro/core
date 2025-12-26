import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Theme, ThemeDocument } from './entities/theme.entity';
import { CreateThemeDto } from './dto/create-theme.dto';
import { UpdateThemeDto } from './dto/update-theme.dto';

@Injectable()
export class ThemesService {
  constructor(
    @InjectModel(Theme.name, 'core')
    private readonly themeModel: Model<ThemeDocument>,
  ) { }

  async create(data: CreateThemeDto) {
    const newClient = new this.themeModel(data);
    return newClient.save();
  }

  findAll(query: Record<string, any>) {
    const { limit, offset } = query;

    const limitValue = Number.parseInt(limit ?? '', 10);

    return this.themeModel
      .find()
      .sort({ sortOrder: 1 })
      .skip(offset)
      .limit(Number.isNaN(limitValue) ? 10 : limitValue)
      .exec();
  }

  findOne(id: string) {
    return this.themeModel.findOne({ _id: id }).exec();
  }

  update(id: string, data: UpdateThemeDto) {
    return this.themeModel
      .findByIdAndUpdate({ _id: id }, { ...data }, { new: true })
      .lean();
  }

  async remove(id: string) {
    await this.themeModel.deleteOne({ _id: id }).exec()
  }
}
