import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { ProjectStatus } from 'src/common/enums/project.enum'
import { Project } from 'src/core/projects/entities/project.entity';

@Schema({ timestamps: true })
export class Domain {
  @Prop({ required: true })
  host: string;

  @Prop({
    required: true,
    enum: ProjectStatus,
    default: ProjectStatus.Draft,
  })
  status: ProjectStatus;

  @Prop(
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      default: null,
    },
  )
  projectId: Project;
}

export type DomainDocument = Domain & Document;
export const DomainSchema = SchemaFactory.createForClass(Domain);
