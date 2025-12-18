import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { Currency, User, UserDocument } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(data: CreateUserDto) {
    const newUser = new this.userModel(data);
    return newUser.save();
  }

  async findAll(query: Record<string, any>) {
    const { limit } = query;

    // const filter: Record<string, any> = {};
    // if (owner) filter.owner = owner;

    // return this.userModel.find().exec();

    const limitValue = Number.parseInt(limit ?? '', 10);

    return this.userModel
      .find()
      .sort({ createdAt: -1 })
      .limit(Number.isNaN(limitValue) ? 10 : limitValue)
      .exec();
  }

  async findOne(id: string) {
    return this.userModel.findOne({ _id: id }).exec();
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async update(
    id: string,
    data: UpdateUserDto,
  ): Promise<User & Record<string, any>> {

    // поддержим оба варианта, на будущее
    const payload: UpdateUserDto = (data as any)?.body ?? (data as any);

    const oldUser = await this.userModel.findById(id).lean();
    if (!oldUser) throw new NotFoundException('Пользователь не найден');

    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        id,
        { $set: payload },
        {
          new: true,
          runValidators: true, // валидируем по схеме
          timestamps: true, // на всякий
        },
      )
      .lean();

    // если нужно вернуть старые значения для интерсепторов
    const oldFields: Record<string, any> = {};
    for (const key of ['avatar']) oldFields[`_${key}`] = oldUser[key];

    return { ...updatedUser, ...oldFields } as User & Record<string, any>;
  }

  async remove(id: string) {
    return this.userModel.findOneAndDelete({ _id: id }).exec();
  }

  async addBalance(
    userId: string,
    amount: number,
    currency: Currency,
  ): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('Пользователь не найден');

    // Проверка на валидность суммы
    if (isNaN(amount) || amount === 0) {
      throw new BadRequestException('Сумма должна быть ненулевым числом');
    }

    // Инициализация баланса, если его нет
    if (!Array.isArray(user.balance)) {
      user.balance = [];
    }

    // Ищем баланс по нужной валюте
    const balanceIndex = user.balance.findIndex((b) => b.currency === currency);

    if (balanceIndex !== -1) {
      // Если баланс по валюте существует — добавляем сумму
      const newBalance = user.balance[balanceIndex].balance + amount;

      if (newBalance < 0) {
        throw new BadRequestException('Недостаточно средств на счёте');
      }

      user.balance[balanceIndex].balance = newBalance;
    } else {
      // Если валюты нет в списке — добавляем новый объект
      if (amount < 0) {
        throw new BadRequestException(
          'Нельзя списать средства по неинициализированной валюте',
        );
      }

      user.balance.push({ currency, balance: amount });
    }

    // Явно помечаем массив balance как изменённый
    user.markModified('balance');

    return await user.save();
  }
}
