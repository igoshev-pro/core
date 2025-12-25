import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
  ) { }

  async create(data: CreateClientDto) {
    const isExist = await this.findByEmail(data.email)
    if (isExist) throw new HttpException('Пользователь с таким email уже зарегистрирован', HttpStatus.CONFLICT)

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
      .populate('projects')
      .exec();
  }

  findOne(id: string) {
    return this.clientModel.findOne({ _id: id }).populate([{ path: 'projects', model: 'Project' }]).exec();
  }

  async findByEmail(email: string) {
    return this.clientModel.findOne({ email }).populate([{ path: 'projects', model: 'Project' }]).exec();
  }

  update(id: string, data: UpdateClientDto) {
    return this.clientModel
      .findByIdAndUpdate({ _id: id }, { ...data }, { new: true })
      .lean();
  }

  async remove(id: string) {
    // const client: any = await this.clientModel
    //   .findOne({ _id: id })
    //   .lean()
    //   .exec();

    // if (!client) return;

    // 1️⃣ удалить проекты пользователя
    // await this.projectsService.removeManyByIds(client?.projects ?? []);

    // 2️⃣ удалить пользователя
    await this.clientModel.deleteOne({ _id: id }).exec()
  }
}
