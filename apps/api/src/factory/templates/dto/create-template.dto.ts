import { I18nString } from "src/common/types/i18n";

export class CreateTemplateDto {
    name: I18nString;
    sortOrder?: number;
    status?: string;
    mode?: string;
}
