import { FileObject } from "src/common/types/file-object";
import { I18nString } from "src/common/types/i18n";

export class UpdateLayoutDto {
    name?: I18nString;
    layoutKey?: string;
    type?: string
    sortOrder?: number;
    status?: string;
    mode?: string;
    slots?: any[];
    previewPath?: string | null;
    gallery?: FileObject[];
}
