import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export enum PageType {
  Deafault = 'default',
  Landing = 'landing',
}

export type PageDocument = Page & Document;

@Schema({ timestamps: true })
export class Page {
  @Prop({ default: PageType.Deafault, enum: PageType, required: true })
  type: PageType;

  @Prop({ required: true }) title: string;

  @Prop({ required: true }) slug: string; // slug страницы (например, "about-us")

  @Prop({ default: 'default' }) template?: string; // шаблон рендера (layout)

  @Prop({ required: true }) path: string;

  @Prop({
    type: {
      title: String,
      description: String,
      keywords: String,
      ogImage: String,
    },
    default: {},
  })
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
    ogImage?: string;
  };

  @Prop({ default: true }) isVisible?: boolean; // отображать ли страницу на сайте
  @Prop({ default: false }) isHome?: boolean; // является ли главной страницей
  @Prop({ default: false }) isProtected?: boolean; // нужна ли авторизация для просмотра

  @Prop({ type: Number, default: 0 }) order?: number; // порядок в меню или дереве страниц
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Page', default: null })
  parent?: Page | null; // родительская страница (для вложенных структур)

  @Prop({ type: [String], default: [] })
  tags?: string[]; // теги для фильтрации или группировки

  @Prop({ type: Date, default: null }) publishAt?: Date; // дата публикации
  @Prop({ type: Date, default: null }) unpublishAt?: Date; // дата снятия с публикации

  /** Секции (отдельная модель) */
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Section' }],
    default: [],
  })
  sections: mongoose.Types.ObjectId[];

  /** Связь с проектом */
  // @Prop({
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Project',
  //   required: true,
  // })
  // project: Project;

  @Prop({ type: String })
  preview?: string;
}

export const PageSchema = SchemaFactory.createForClass(Page);
