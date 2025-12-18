import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { UiSchema } from '../../common/decorators/ui-schema.decorator';

// Если у тебя уже есть эти enum в другом файле — лучше импортни их оттуда.
// Оставляю здесь для самодостаточности.
export enum UserStatus {
  Active = 'active',
  Inactive = 'inactive',
  Draft = 'draft',
  Archived = 'archived',
}

export enum UserRole {
  User = 'user',
  Admin = 'admin',
  SuperAdmin = 'superAdmin',
}

export enum Currency {
  RUB = 'RUB',
  USD = 'USD',
  EUR = 'EUR',
}

/** Элемент баланса пользователя */
export class UserBalanceItemDto {
  @IsNumber()
  @UiSchema({
    label: 'Сумма',
    placeholder: '1000',
    group: 'Баланс',
    order: 1,
    widget: 'input',
  })
  balance: number;

  @IsEnum(Currency)
  @UiSchema({
    label: 'Валюта',
    widget: 'select',
    placeholder: 'Выберите валюту',
    options: Object.values(Currency),
    group: 'Баланс',
    order: 2,
  })
  currency: Currency;
}

/** Создание пользователя */
export class CreateUserDto {
  @IsString()
  @UiSchema({
    label: 'Имя',
    placeholder: 'Иван Петров',
    group: 'Основное',
    order: 1,
  })
  name: string;

  @IsEmail()
  @UiSchema({
    label: 'Email',
    placeholder: 'user@example.com',
    group: 'Основное',
    order: 2,
  })
  email: string;

  @IsOptional()
  @IsString()
  @UiSchema({
    label: 'OTP (одноразовый код)',
    placeholder: '123456',
    widget: 'textarea',
    group: 'Безопасность',
    order: 1,
  })
  otp?: string;

  @IsOptional()
  @IsString()
  @UiSchema({
    label: 'Аватар',
    placeholder: 'https://example.com/avatar.png',
    group: 'Медиа',
    widget: 'image',
    order: 1,
  })
  avatar?: string;

  @IsOptional()
  @IsEnum(UserRole)
  @UiSchema({
    label: 'Роль',
    widget: 'select',
    placeholder: 'Выберите роль',
    options: Object.values(UserRole),
    group: 'Статус и роль',
    order: 1,
  })
  role?: UserRole;

  @IsOptional()
  @IsEnum(UserStatus)
  @UiSchema({
    label: 'Статус',
    widget: 'select',
    placeholder: 'Выберите статус',
    options: Object.values(UserStatus),
    group: 'Статус и роль',
    order: 2,
  })
  status?: UserStatus;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserBalanceItemDto)
  @UiSchema({
    label: 'Баланс (списки)',
    widget: 'array',
    group: 'Баланс',
    order: 10,
    // генератор возьмёт поля из класса UserBalanceItemDto
  })
  balance?: UserBalanceItemDto[];

  @IsOptional()
  @IsEnum(Currency)
  @UiSchema({
    label: 'Текущая валюта',
    widget: 'select',
    placeholder: 'Выберите валюту',
    options: Object.values(Currency),
    group: 'Баланс',
    order: 3,
  })
  currentCurrency?: Currency;
}

/** Обновление пользователя */
export class UpdateUserDto extends PartialType(CreateUserDto) {}