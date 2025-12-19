import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import type { Page } from 'src/feature/page/page.entity';

export type SectionDocument = Section & Document;

@Schema({ timestamps: true })
export class Section {
  /** Тип секции (hero, gallery, form, testimonials, features и т.п.) */
  @Prop({ required: true }) type: string;

  /** Название секции для админки (не отображается на сайте) */
  @Prop({ required: false }) name?: string;

  /** Содержимое секции (гибкая схема) */
  @Prop({ type: Object }) data?: Record<string, any>;

  /** Порядок отображения секции на странице */
  @Prop({ type: Number, default: 0 }) order: number;

  /** Статус отображения (активна или скрыта) */
  @Prop({ type: Boolean, default: true }) isActive: boolean;

  /** Вариант оформления (light, dark, custom и т.д.) */
  @Prop({ required: false }) variant?: string;

  /** ID страницы, к которой привязана секция */
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Page', required: true })
  page: Page;
}

export const SectionSchema = SchemaFactory.createForClass(Section);
