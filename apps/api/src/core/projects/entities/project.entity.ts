// src/projects/entities/project.entity.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ProjectStatus, ProjectType } from '../project.enum';
import { Client } from '../../clients/entities/client.entity';
import { type I18nMap } from 'src/common/types/i18n.types';
import { FileObject } from 'src/common/types/file-object';
import { SiteSchema } from './site-schema.entity';

export type ProjectDocument = Project & Document;

export type ProjectTemplate = {
  public: string;
  admin: string;
  auth: string;
};

export type ProjectTheme = {
  public: string;
  admin: string;
  auth: string;
};

export type ProjectSeoDefaults = {
  title?: I18nMap;
  description?: I18nMap;
  ogImage?: string;
};

export type I18n = {
  locales: string[];
  defaultLocal: string;
};

// ===================== NEW: Settings types =====================
export type ProjectAddress = {
  country?: string;
  region?: string;
  city?: string;
  street?: string;
  house?: string;
  postalCode?: string;
  placeId?: string;
  geo?: {
    lat?: number;
    lng?: number;
  };
};

export type ProjectSocialLinks = {
  instagram?: string;
  facebook?: string;
  vk?: string;
};

export type ProjectContacts = {
  phones?: string[];
  emails?: string[];
  telegram?: string;
  whatsApp?: string;
};

export type ProjectAnalytics = {
  ga4Id?: string;
  ymId?: string;
  metaPixelId?: string;
};

export type ProjectSettings = {
  companyName?: I18nMap;
  companyLogoPath?: string;
  companyLogoDarkPath?: string;
  companyLogoAltPath?: string;
  faviconPath?: string;
  seoDefaults?: ProjectSeoDefaults;
  address?: ProjectAddress;
  socialLinks?: ProjectSocialLinks;
  contacts?: ProjectContacts;
  analytics?: ProjectAnalytics;
};

// ===================== Schema =====================
@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true })
  domainTech?: string;

  @Prop({ required: false, type: String })
  domainCustom?: string;

  @Prop({ type: Object, default: {} })
  name!: I18nMap;

  @Prop({
    type: Object,
    default: {
      locales: ['ru'],
      defaultLocal: 'ru',
    },
  })
  i18n: I18n;

  @Prop({ type: String, required: false, default: null })
  previewPath?: string | null;

  @Prop()
  gallery?: FileObject[];

  @Prop({ default: 0, index: true })
  sortOrder: number;

  @Prop({ required: true, enum: Object.values(ProjectType) })
  type?: ProjectType;

  @Prop({ default: ProjectStatus.ACTIVE, enum: Object.values(ProjectStatus) })
  status?: ProjectStatus;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: false })
  owner?: Client;

  @Prop({ type: Object, default: {} })
  db: {
    mongo?: { uri: string; name: string };
  };

  // Bootstrap & schema
  @Prop({ type: Object, required: false })
  template?: ProjectTemplate;

  @Prop({ type: Object, required: false })
  theme?: ProjectTheme;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SiteSchema',
    required: false,
    default: null,
  })
  site?: mongoose.Types.ObjectId | SiteSchema | null;

  @Prop({ type: Object, required: false })
  seoDefaults?: ProjectSeoDefaults;

  // ===================== NEW: Settings field =====================
  @Prop({ type: Object, default: {} })
  settings?: ProjectSettings;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
