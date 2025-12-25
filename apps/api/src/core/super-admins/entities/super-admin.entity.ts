import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserRole, UserStatus } from 'src/common/enums/user.enum'

@Schema({ timestamps: true })
export class SuperAdmin {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  otp: string;

  @Prop({ type: String })
  avatar?: string;

  @Prop({ default: UserRole.SuperAdmin, enum: UserRole, required: true })
  role: UserRole;

  @Prop({
    required: true,
    enum: UserStatus,
    default: UserStatus.Active,
  })
  status: UserStatus;
}

export type SuperAdminDocument = SuperAdmin & Document;
export const SuperAdminSchema = SchemaFactory.createForClass(SuperAdmin);
