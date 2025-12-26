import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { EntityStatus } from 'src/common/enums/status.enum';
import { FileObject } from 'src/common/types/file-object';
import type { I18nString } from 'src/common/types/i18n';

@Schema({ timestamps: true })
export class Widget {
    @Prop({ required: true, type: Object })
    name: I18nString;

    @Prop({ required: true, type: String })
    key: String;

    @Prop({ required: false, type: String, default: 'widget' })
    type: 'widget';

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
}

export type WidgetDocument = Widget & Document;
export const WidgetSchema = SchemaFactory.createForClass(Widget);
