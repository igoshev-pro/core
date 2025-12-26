import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Mode } from 'src/common/enums/mod.enum';
import { EntityStatus } from 'src/common/enums/status.enum';
import { FileObject } from 'src/common/types/file-object';
import type { I18nString } from 'src/common/types/i18n';

type Slots = {
    header?: any
    footer?: any
    sidebar?: any
}

@Schema({ timestamps: true })
export class Layout {
    @Prop({ required: true, type: Object })
    name: I18nString;

    @Prop({ required: true, type: String })
    slug: String;

    @Prop({ required: false, type: String, default: 'layout' })
    type: String;

    @Prop({ default: 0, index: true })
    sortOrder: number;

    @Prop({
        required: true,
        enum: EntityStatus,
        default: EntityStatus.DRAFT,
    })
    status: EntityStatus;

    @Prop({
        required: true,
        enum: Mode,
        default: Mode.PUBLIC,
    })
    mode: Mode;

    @Prop({ required: false, type: Object })
    slots: Slots;

    @Prop({ type: String, required: false, default: null })
    previewPath?: string | null;

    @Prop()
    gallery?: FileObject[];
}

export type LayoutDocument = Layout & Document;
export const LayoutSchema = SchemaFactory.createForClass(Layout);