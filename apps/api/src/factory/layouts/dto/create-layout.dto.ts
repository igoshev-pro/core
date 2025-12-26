import { I18nString } from "src/common/types/i18n";

export class CreateLayoutDto {
    name: I18nString;
    slug: String;
    sortOrder?: number;
    status?: string;
    mode?: string;
    slots?: any;
}
