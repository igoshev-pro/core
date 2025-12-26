import { I18nString } from "src/common/types/i18n";

export class CreatePageDto {
    name: I18nString;
    key: string;
    template: string;
    path: string;
    type?: string;
    sortOrder?: number;
    status?: string;
    previewPath?: string | null;
    gallery?: any[];
    blocks?: any[]
}
