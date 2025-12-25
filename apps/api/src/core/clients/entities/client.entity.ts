import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { UserRole, UserStatus } from 'src/common/enums/user.unum'
import { UserPhoto } from 'src/common/types/user';
import { Project } from 'src/core/projects/entities/project.entity';

@Schema({ timestamps: true })
export class Client {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: 0, index: true })
  sortOrder: number;

  @Prop()
  otp: string;

  @Prop({ type: String, required: false, default: null })
  avatarPath?: string | null; // быстрый доступ к главной фотке

  @Prop()
  photos?: UserPhoto[]; 

  @Prop({ default: UserRole.Client, enum: UserRole, required: true })
  role: UserRole;

  @Prop({
    required: true,
    enum: UserStatus,
    default: UserStatus.Active,
  })
  status: UserStatus;

  @Prop([
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      default: null,
    },
  ])
  projects: Project[];
}

export type ClientDocument = Client & Document;
export const ClientSchema = SchemaFactory.createForClass(Client);

ClientSchema.index({ projectId: 1, sortOrder: 1 });
