import { Injectable } from '@nestjs/common';
import { CreateSuperAdminDto } from './dto/create-super-admin.dto';
import { UpdateSuperAdminDto } from './dto/update-super-admin.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SuperAdmin, type SuperAdminDocument } from './entities/super-admin.entity';
import { Model } from 'mongoose';

@Injectable()
export class SuperAdminsService {
  constructor(
    @InjectModel(SuperAdmin.name, 'core')
    private readonly superAdminModel: Model<SuperAdminDocument>,
  ) {}

  create(data: CreateSuperAdminDto) {
    const newSuperAdmin = new this.superAdminModel(data);
    return newSuperAdmin.save();
  }

  findAll(query: Record<string, any>) {
    const { limit } = query;

    const limitValue = Number.parseInt(limit ?? '', 10);

    return this.superAdminModel
      .find()
      .sort({ createdAt: -1 })
      .limit(Number.isNaN(limitValue) ? 10 : limitValue)
      .exec();
  }

  findOne(id: string) {
    return this.superAdminModel.findOne({ _id: id }).exec();
  }

  async findByEmail(email: string) {
    return this.superAdminModel.findOne({ email }).exec();
  }

  update(id: string, data: UpdateSuperAdminDto) {
    return this.superAdminModel
      .findByIdAndUpdate({ _id: id }, { ...data }, { new: true })
      .lean();
  }

  remove(id: string) {
    return this.superAdminModel.findOneAndDelete({ _id: id }).exec();
  }
}
