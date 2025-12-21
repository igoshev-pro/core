import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectTenantModel } from 'src/tenant/inject-tenant-model.decorator';

@Injectable()
export class UsersService {
  constructor(
    @InjectTenantModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) { }

  create(data: CreateUserDto) {
    const newUser = new this.userModel(data);
    return newUser.save();
  }

  findAll(query: Record<string, any>) {
    const { limit } = query;

    const limitValue = Number.parseInt(limit ?? '', 10);

    return this.userModel
      .find()
      .sort({ createdAt: -1 })
      .limit(Number.isNaN(limitValue) ? 10 : limitValue)
      .exec();
  }

  findOne(id: string) {
    return this.userModel.findOne({ _id: id }).exec();
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  update(id: string, data: UpdateUserDto) {
    return this.userModel
      .findByIdAndUpdate({ _id: id }, { ...data }, { new: true })
      .lean();
  }

  remove(id: string) {
    return this.userModel.findOneAndDelete({ _id: id }).exec();
  }
}
