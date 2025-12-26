import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { EntityStatus } from 'src/common/enums/status.enum';
import type { I18nString } from 'src/common/types/i18n';

@Schema({ timestamps: true })
export class Theme {
    @Prop({ required: true, type: Object })
    name: I18nString;

    @Prop({ required: true, type: String })
    slug: String;

    @Prop({ required: true, type: String })
    colorPrimary: String;

    @Prop({ required: true, type: String })
    colorSecondary: String;

    @Prop({ required: true, type: String })
    fontSans: String;

    @Prop({ default: 0, index: true })
    sortOrder: number;

    @Prop({
        required: true,
        enum: EntityStatus,
        default: EntityStatus.DRAFT,
    })
    status: EntityStatus;
}

export type ThemeDocument = Theme & Document;
export const ThemeSchema = SchemaFactory.createForClass(Theme);