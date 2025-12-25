import { FileObject } from "src/common/types/file-object";
import { I18nString } from "src/common/types/i18n";

export class UpdateTemplateDto {
    name?: I18nString;
    sortOrder?: number;
    status?: string;
    mode?: string;
    previewPath?: string | null;
    gallery?: FileObject[];
}
