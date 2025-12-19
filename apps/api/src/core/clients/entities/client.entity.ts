import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserRole, UserStatus } from 'src/common/enums/user.unum'

@Schema({ timestamps: true })
export class Client {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  otp: string;

  @Prop({ type: String })
  avatar?: string;

  @Prop({ default: UserRole.Client, enum: UserRole, required: true })
  role: UserRole;

  @Prop({
    required: true,
    enum: UserStatus,
    default: UserStatus.Active,
  })
  status: UserStatus;
}

export type ClientDocument = Client & Document;
export const ClientSchema = SchemaFactory.createForClass(Client);
