import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ProjectStatus, ProjectType } from '../project.enum'
import { Client } from '../../clients/entities/client.entity';

export type ProjectDocument = Project & Document;

export type ProjectTemplate = {
  public: string
  admin: string
  auth: string
}

export type ProjectTheme = {
  public: string;
  admin: string;
  auth: string
}

export type SiteLayout = {
  _id: string
  type: string
  layoutKey: string // идентификатор лейаута для регистри public.default
  slots?: {
    sidebar?: any[]
  }
}

export type SiteBlock = {
  _id: string
  type: "widget" | "section"
  key: string, // идентификатор 404.v1
  props: any
}

export type PageAccess = {
  auth?: boolean;                 // требуется логин
  roles?: string[];               // роли (любой из списка)
  features?: string[];
  redirectTo?: string;            // куда при запрете (по умолчанию /login)

  permissions?: string[];         // пермишены (любой из списка)// фичи проекта (включены)
  all?: boolean;                  // если true: roles/permissions/features должны выполняться ВСЕ (AND),
  // иначе по умолчанию: внутри каждого массива - OR, а массивы между собой - AND
  hideInMenuIfNoAccess?: boolean; // чтобы меню не показывало
};

export type SitePage = {
  _id: string,
  path: string,
  kind: "static" | "dynamic"
  access: PageAccess
  blocks: SiteBlock[]
}

export type ProjectSiteSchema = {
  public: {
    version?: string
    layout: SiteLayout
    pages: SitePage[]
  }; // SiteSchema
  admin: {
    version?: string
    layout: SiteLayout
    pages: SitePage[]
  }  // SiteSchema
  login: {
    version?: string
    layout: SiteLayout
    pages: SitePage[]
  }; // SiteSchema
}

export type ProjectSeoDefaults = {
  title?: string;
  description?: string;
  ogImage?: string;
}

@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true })
  domainTech?: string;

  @Prop({ required: false, type: String })
  domainCustom?: string;

  @Prop({ required: true })
  name: string;

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

  @Prop({ type: Object, required: false })
  site?: ProjectSiteSchema

  @Prop({ type: Object, required: false })
  seoDefaults?: ProjectSeoDefaults

  // @Prop({ required: true, unique: true }) slug: string;
  // @Prop() description?: string;
  // @Prop() preview?: string;
  // @Prop() logo?: string;
  // @Prop() logoSmall?: string;

  // @Prop({
  //   type: ProjectFeatures,
  //   default: {
  //     topLevel: [],
  //     cmsFeatures: [],
  //     entityFeatures: [],
  //     modulesFeatures: [],
  //   },
  // })
  // features: ProjectFeatures;

  // @Prop({
  //   type: {
  //     template: {
  //       name: { type: String, default: 'Default' },
  //     },
  //     theme: {
  //       primaryColor: { type: String, default: '#000000' },
  //       secondaryColor: { type: String, default: '#ffffff' },
  //       accentColor: { type: String, default: '#ff0000' },
  //     },
  //     fonts: {
  //       primary: { type: String, default: 'Roboto' },
  //       secondary: { type: String, default: 'Arial' },
  //     },
  //   },
  //   default: {},
  // })
  // siteSettings: {
  //   theme: {
  //     primaryColor: string;
  //     secondaryColor: string;
  //     accentColor: string;
  //   };
  //   fonts: { primary: string; secondary: string };
  // };

  // @Prop({ type: Object })
  // contacts?: Contacts;

  // @Prop({ type: Object })
  // socialLinks?: SocialLinks;

  // @Prop({ type: Object })
  // address?: Address;

  // @Prop({
  //   type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Page' }],
  //   default: [],
  // })
  // pages: mongoose.Types.ObjectId[];

  // @Prop({ type: Array, default: [] }) entities: EntitySchema[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);