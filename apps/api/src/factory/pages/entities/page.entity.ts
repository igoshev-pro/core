import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Kind } from 'src/common/enums/page.enum';
import { EntityStatus } from 'src/common/enums/status.enum';
import { FileObject } from 'src/common/types/file-object';
import type { I18nString } from 'src/common/types/i18n';
import { Section } from 'src/factory/sections/entities/section.entity';
import { Widget } from 'src/factory/widgets/entities/widget.entity';

@Schema()
export class BlockRef {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "blocks.kind",
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
export class Page {
    @Prop({ required: true, type: Object })
    name: I18nString;

    @Prop({ required: true, type: String })
    key: String;

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
        enum: Kind,
        default: Kind.STATIC,
    })
    kind: Kind;

    @Prop({ type: String, required: false, default: null })
    previewPath?: string | null;

    @Prop()
    gallery?: FileObject[];

    @Prop({ type: [BlockRef], default: [] })
    blocks!: BlockRef[];
}

export type PageDocument = Page & Document;
export const PageSchema = SchemaFactory.createForClass(Page);