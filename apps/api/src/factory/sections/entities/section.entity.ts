import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { EntityStatus } from 'src/common/enums/status.enum';
import { FileObject } from 'src/common/types/file-object';
import type { I18nString } from 'src/common/types/i18n';
import { Widget } from 'src/factory/widgets/entities/widget.entity';

@Schema({ timestamps: true })
export class Section {
    @Prop({ required: true, type: Object })
    name: I18nString;

    @Prop({ required: true, type: String })
    key: String;

    @Prop({ required: false, type: String, default: 'section' })
    type: 'section';

    @Prop({ default: 0, index: true })
    sortOrder: number;

    @Prop({
        required: true,
        enum: EntityStatus,
        default: EntityStatus.DRAFT,
    })
    status: EntityStatus;

    @Prop({ type: String, required: false, default: null })
    previewPath?: string | null;

    @Prop()
    gallery?: FileObject[];

    @Prop({ type: Object, required: false })
    props?: Object

    @Prop([
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Widget',
            default: null,
        },
    ])
    widgets?: Widget[]
}

export type SectionDocument = Section & Document;
export const SectionSchema = SchemaFactory.createForClass(Section);