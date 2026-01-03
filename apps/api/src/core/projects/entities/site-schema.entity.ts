import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

// --- твои типы (можно вынести в отдельный файл types.ts) ---

export type SiteLayout = {
  _id: string;
  type: string;
  layoutKey: string;
  slots?: {
    sidebar?: any[];
  };
};

export type SiteBlock = {
  _id: string;
  type: 'widget' | 'section';
  key: string; // идентификатор 404.v1
  props: any;
};

export type PageAccess = {
  auth?: boolean;
  roles?: string[];
  features?: string[];
  redirectTo?: string;

  permissions?: string[];
  all?: boolean;
  hideInMenuIfNoAccess?: boolean;
};

export type SitePage = {
  _id: string;
  name: string;
  path: string;
  kind: 'static' | 'dynamic';
  access: PageAccess;
  blocks: SiteBlock[];
};

export type SiteSchemaSection = {
  version?: string;
  layout: SiteLayout;
  pages: SitePage[];
};

export type ProjectSiteSchema = {
  public: SiteSchemaSection;
  admin: SiteSchemaSection;
  login: SiteSchemaSection;
};

// --- mongoose entity ---

export type SiteSchemaDocument = SiteSchema & Document;

@Schema({ timestamps: true })
export class SiteSchema {
  // ВАЖНО: ключи public/admin/login оставляем как есть (чтобы не менять контракт)
  // Но "public" — ключевое слово, поэтому используем string-literal property name.

  @Prop({ type: Object, required: true })
  'public'!: SiteSchemaSection;

  @Prop({ type: Object, required: true })
  admin!: SiteSchemaSection;

  @Prop({ type: Object, required: true })
  login!: SiteSchemaSection;

  // Если нужно привязать схему к проекту (удобно для поиска/каскадных удалений)
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Project', index: true, required: false })
  projectId?: mongoose.Types.ObjectId;
}

export const SiteSchemaSchema = SchemaFactory.createForClass(SiteSchema);
