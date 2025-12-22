import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ProjectStatus, ProjectType } from '../project.enum'
import { Client } from '../../clients/entities/client.entity';

export type ProjectDocument = Project & Document;

@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true })
  domainTech?: string;

  @Prop({ required: false, type: String })
  domainCustom?: string;

  @Prop({ required: true }) 
  name: string;

  @Prop({ required: true, enum: Object.values(ProjectType) })
  type?: ProjectType;

  @Prop({ default: ProjectStatus.ACTIVE, enum: Object.values(ProjectStatus) })
  status?: ProjectStatus;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Client' }) 
  owner: Client;

  @Prop({ type: Object, default: {} })
  db: {
    mongo?: { uri: string; name: string };
  };

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

