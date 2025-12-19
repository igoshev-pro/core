import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SuperAdmin, type SuperAdminDocument } from './entities/super-admin.entity';
import { Model } from 'mongoose';

@Injectable()
export class SuperAdminsService {
  constructor(
    @InjectModel(SuperAdmin.name)
    private readonly superAdminModel: Model<SuperAdminDocument>,
  ) {}

  create(data: CreateAdminDto) {
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

  update(id: string, data: UpdateAdminDto) {
    return this.superAdminModel
      .findByIdAndUpdate({ _id: id }, { ...data }, { new: true })
      .lean();
  }

  remove(id: string) {
    return this.superAdminModel.findOneAndDelete({ _id: id }).exec();
  }
}
