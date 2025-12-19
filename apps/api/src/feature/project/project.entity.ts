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
  @Prop({ required: true, unique: true }) url: string;
  @Prop({ required: true, unique: true }) slug: string;
  @Prop({ required: true }) name: string;

  @Prop() description?: string;
  @Prop() preview?: string;
  @Prop() logo?: string;
  @Prop() logoSmall?: string;

  @Prop({ required: true, enum: Object.values(ProjectType) })
  type: ProjectType;

  @Prop({ default: ProjectStatus.ACTIVE, enum: Object.values(ProjectStatus) })
  status: ProjectStatus;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' }) owner: User;

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
    // pg?: {
    //   host: string;
    //   port: number;
    //   user: string;
    //   pass: string;
    //   name: string;
    //   entities: string[];
    // };
    mongo?: { uri: string; name: string };
  };

  @Prop({
    type: {
      template: {
        name: { type: String, default: 'Default' },
      },
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
    theme: {
      primaryColor: string;
      secondaryColor: string;
      accentColor: string;
    };
    fonts: { primary: string; secondary: string };
  };

  @Prop({ type: Object })
  contacts?: Contacts;

  @Prop({ type: Object })
  socialLinks?: SocialLinks;

  @Prop({ type: Object })
  address?: Address;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Page' }],
    default: [],
  })
  pages: mongoose.Types.ObjectId[];

  @Prop({ type: Array, default: [] }) entities: EntitySchema[];

  @Prop({ default: false }) isDemo?: boolean;
  @Prop({ default: false }) isArchived?: boolean;

  //   domainTech: string | null;    // типа "k3jf92"
  // domainCustom: string | null;  // типа "client.ru"
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
