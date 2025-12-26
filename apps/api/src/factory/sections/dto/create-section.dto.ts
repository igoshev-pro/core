import { I18nString } from "src/common/types/i18n";

export class CreateSectionDto {
    name: I18nString;
    key: string;
    template: string;
    type?: string;
    sortOrder?: number;
    status?: string;
    previewPath?: string | null;
    gallery?: any[];
    props?: any
    widgets?: any[]
}