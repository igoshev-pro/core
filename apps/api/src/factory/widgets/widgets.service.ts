import { Injectable } from '@nestjs/common';
import { CreateWidgetDto } from './dto/create-widget.dto';
import { UpdateWidgetDto } from './dto/update-widget.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Widget, WidgetDocument } from './entities/widget.entity';
import { Model } from 'mongoose';

@Injectable()
export class WidgetsService {
  constructor(
    @InjectModel(Widget.name, 'core')
    private readonly widgetModel: Model<WidgetDocument>,
  ) { }

  async create(data: CreateWidgetDto) {
    const newWidget = new this.widgetModel(data);
    return newWidget.save();
  }

  findAll(query: Record<string, any>) {
    const { limit, offset } = query;

    const limitValue = Number.parseInt(limit ?? '', 10);

    return this.widgetModel
      .find()
      .sort({ sortOrder: 1 })
      .skip(offset)
      .limit(Number.isNaN(limitValue) ? 10 : limitValue)
      .exec();
  }

  findOne(id: string) {
    return this.widgetModel.findOne({ _id: id }).exec();
  }

  update(id: string, data: UpdateWidgetDto) {
    return this.widgetModel
      .findByIdAndUpdate({ _id: id }, { ...data }, { new: true })
      .lean();
  }

  async remove(id: string) {
    await this.widgetModel.deleteOne({ _id: id }).exec()
  }
}
