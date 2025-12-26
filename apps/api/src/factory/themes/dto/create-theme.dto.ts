import { I18nString } from "src/common/types/i18n";

export class CreateThemeDto {
    name: I18nString;
    sortOrder?: number;
    status?: string;
    slug: String;
    colorPrimary: String;
    colorSecondary: String;
    fontSans: String;
}