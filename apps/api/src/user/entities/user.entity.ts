import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserBalance = {
  balance: number;
  currency: Currency;
};

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

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  otp: string;

  @Prop({ type: String })
  avatar?: string;

  @Prop({ default: UserRole.User, enum: UserRole, required: true })
  role: UserRole;

  @Prop({
    required: true,
    enum: UserStatus,
    default: UserStatus.Active,
  })
  status: UserStatus;

  @Prop({ type: [Object] })
  balance: UserBalance[];

  @Prop({ enum: Currency, default: Currency.RUB, required: true })
  currentCurrency: Currency;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
