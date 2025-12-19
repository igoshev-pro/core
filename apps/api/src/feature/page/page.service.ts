import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePageDto, UpdatePageDto } from './page.dto';
import { Model } from 'mongoose';
import { Page, PageSchema, PageDocument } from './page.entity';
import { TenantMongoService } from 'src/core/tenant/tenant-mongo.service';

@Injectable()
export class PageService {
  private pageModel: Model<PageDocument>;

  constructor(private readonly tenantMongo: TenantMongoService) {}

  async initModel() {
    if (!this.pageModel) {
      this.pageModel = await this.tenantMongo.getModel<PageDocument>(
        Page.name,
        PageSchema,
      );
    }
  }

  async create(data: CreatePageDto) {
    await this.initModel();
    const newUser = new this.pageModel(data);
    return newUser.save();
  }

  async findAll(query: Record<string, any>) {
    await this.initModel();

    const { limit } = query;

    const limitValue = Number.parseInt(limit ?? '', 10);

    return this.pageModel
      .find()
      .sort({ createdAt: -1 })
      .limit(Number.isNaN(limitValue) ? 10 : limitValue)
      .exec();
  }

  async findOne(id: string) {
    await this.initModel();
    return this.pageModel.findOne({ _id: id }).exec();
  }

  async update(id: string, data: UpdatePageDto) {
    await this.initModel();

    const payload: UpdatePageDto = data;

    const entity = await this.pageModel.findById(id).lean();
    if (!entity) throw new NotFoundException('Сущность с данным id не найдена');

    const updatedUser = await this.pageModel
      .findByIdAndUpdate(
        id,
        { $set: payload },
        {
          new: true,
          runValidators: true,
          timestamps: true,
        },
      )
      .exec();

    const oldFields: Record<string, any> = {};
    for (const key of ['preview', 'ogImage'])
      oldFields[`_${key}`] = entity[key];

    return { ...updatedUser, ...oldFields } as Page & Record<string, any>;
  }

  async remove(id: string) {
    await this.initModel();
    return this.pageModel.findOneAndDelete({ _id: id }).exec();
  }
}
