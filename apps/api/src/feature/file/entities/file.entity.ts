import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FileDocument = File & Document;

@Schema({ timestamps: true })
export class File {
  @Prop({ required: true })
  ownerId: string;

  @Prop({ required: true })
  type: string; // image, video, document и т.д.

  @Prop({ required: true })
  filename: string; // имя файла с расширением

  @Prop({ required: true })
  size: number; // размер в байтах

  @Prop({ required: true, unique: true })
  token: string; // токен для доступа к файлу
}

export const FileSchema = SchemaFactory.createForClass(File);
