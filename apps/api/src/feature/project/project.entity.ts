// project.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from '../user/user.entity';
import {
  Contacts,
  EntitySchema,
  ProjectFeatures,
  Address,
  SocialLinks,
} from './project.type';
import { ProjectStatus, ProjectType } from './project.enum';

export type ProjectDocument = Project & Document;

@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true })
  name: string;

  /** (опционально) “красивый URL” для админки */
  @Prop()
  url?: string;

  @Prop()
  description?: string;

  @Prop()
  preview?: string;

  @Prop()
  logo?: string;

  @Prop()
  logoSmall?: string;

  /** Мульти-тенант: нормализованные hostnames (без порта/пути) */
  @Prop({ type: [String], default: [], index: true })
  domains: string[];

  /** Основной домен (нормализованный) */
  @Prop({ type: String, index: true })
  primaryDomain?: string;

  @Prop({ required: true, enum: Object.values(ProjectType) })
  type: ProjectType;

  @Prop({ default: ProjectStatus.ACTIVE, enum: Object.values(ProjectStatus) })
  status: ProjectStatus;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: User;

  @Prop({
    type: ProjectFeatures,
    default: {
      topLevel: [],
      cmsFeatures: [],
      entityFeatures: [],
      modulesFeatures: [],
    },
  })
  features: ProjectFeatures;

  @Prop({ type: Object, default: {} })
  db: {
    mongo?: { uri: string; name: string };
  };

  /** То, что нужно фронту для рендера */
  @Prop({ type: String, default: 'landing-default' })
  templateId: string;

  @Prop({ type: String, default: 'default' })
  themeId: string;

  /** CSS vars overrides: { "--color-primary": "red", ... } */
  @Prop({ type: Object, default: {} })
  themeOverrides: Record<string, string>;

  @Prop({
    type: {
      defaultTitle: { type: String, default: '' },
      defaultDescription: { type: String, default: '' },
    },
    default: {},
  })
  seo: { defaultTitle?: string; defaultDescription?: string };

  /** Твои настройки сайта (можно оставить) */
  @Prop({
    type: {
      template: { name: { type: String, default: 'Default' } },
      theme: {
        primaryColor: { type: String, default: '#000000' },
        secondaryColor: { type: String, default: '#ffffff' },
        accentColor: { type: String, default: '#ff0000' },
      },
      fonts: {
        primary: { type: String, default: 'Roboto' },
        secondary: { type: String, default: 'Arial' },
      },
    },
    default: {},
  })
  siteSettings: {
    template?: { name?: string };
    theme?: { primaryColor?: string; secondaryColor?: string; accentColor?: string };
    fonts?: { primary?: string; secondary?: string };
  };

  @Prop({ type: Object })
  contacts?: Contacts;

  @Prop({ type: Object })
  socialLinks?: SocialLinks;

  @Prop({ type: Object })
  address?: Address;

  /** Связь на Page (в tenant-эндпоинте популишь и отдаёшь resolved pages) */
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Page' }],
    default: [],
  })
  pages: mongoose.Types.ObjectId[];

  @Prop({ type: Array, default: [] })
  entities: EntitySchema[];

  @Prop({ default: false })
  isDemo?: boolean;

  @Prop({ default: false })
  isArchived?: boolean;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
ProjectSchema.index({ domains: 1 });
ProjectSchema.index({ primaryDomain: 1 });
