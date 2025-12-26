import { I18nString } from "src/common/types/i18n";

export class CreateWidgetDto {
    name: I18nString;
    key: string;
    type?: string;
    sortOrder?: number;
    status?: string;
    previewPath?: string | null;
    gallery?: any[];
    props?: any
}
