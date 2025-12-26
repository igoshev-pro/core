import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Mode } from 'src/common/enums/mod.enum';
import { EntityStatus } from 'src/common/enums/status.enum';
import { FileObject } from 'src/common/types/file-object';
import type { I18nString } from 'src/common/types/i18n';
import { Template } from 'src/factory/templates/entities/template.entity';

@Schema()
export class SlotRef {
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "slots.kind",
    })
    ref!: mongoose.Types.ObjectId;

    @Prop({
        type: String,
        required: true,
        enum: ["Widget", "Section"],
    })
    kind!: "Widget" | "Section";
}

@Schema({ timestamps: true })
export class Layout {
    @Prop({ required: true, type: Object })
    name: I18nString;

    @Prop({ required: true, type: String })
    layoutKey: String;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Template',
        default: null,
    })
    template: Template

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

    @Prop({ type: String, required: false, default: null })
    previewPath?: string | null;

    @Prop()
    gallery?: FileObject[];

    @Prop({ type: [SlotRef], default: [] })
    slots!: SlotRef[];
}

export type LayoutDocument = Layout & Document;
export const LayoutSchema = SchemaFactory.createForClass(Layout);