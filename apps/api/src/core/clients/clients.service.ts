import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Client, type ClientDocument } from './entities/client.entity';
import { Model } from 'mongoose';

@Injectable()
export class ClientsService {
  constructor(
    @InjectModel(Client.name, 'core')
    private readonly clientModel: Model<ClientDocument>,
  ) {}

  create(data: CreateClientDto) {
    const newClient = new this.clientModel(data);
    return newClient.save();
  }

  findAll(query: Record<string, any>) {
    const { limit } = query;

    const limitValue = Number.parseInt(limit ?? '', 10);

    return this.clientModel
      .find()
      .sort({ createdAt: -1 })
      .limit(Number.isNaN(limitValue) ? 10 : limitValue)
      .exec();
  }

  findOne(id: string) {
    return this.clientModel.findOne({ _id: id }).exec();
  }

  async findByEmail(email: string) {
    return this.clientModel.findOne({ email }).exec();
  }

  update(id: string, data: UpdateClientDto) {
    return this.clientModel
      .findByIdAndUpdate({ _id: id }, { ...data }, { new: true })
      .lean();
  }

  remove(id: string) {
    return this.clientModel.findOneAndDelete({ _id: id }).exec();
  }
}
