// project.dto.ts  (исправления Type() + добавлены поля под фронт-схему)
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
  IsNumber,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { UiSchema } from '../../common/decorators/ui-schema.decorator';
import { Address, EntitySchema } from './project.type';
import { ProjectStatus, ProjectType } from './project.enum';

/** DTO для фич проекта */
export class ProjectFeaturesDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @UiSchema({
    label: 'Top-level фичи',
    widget: 'checkbox',
    options: [
      'dashboard',
      'cms',
      'modules',
      'entities',
      'crm',
      'analytics',
      'settings',
      'cloud',
      'hosting',
    ],
    group: 'Фичи',
    order: 1,
  })
  topLevel?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @UiSchema({
    label: 'CMS фичи',
    widget: 'checkbox',
    options: ['pages', 'sections', 'widgets', 'modals'],
    group: 'Фичи',
    order: 2,
  })
  cmsFeatures?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @UiSchema({
    label: 'Фичи сущностей',
    widget: 'checkbox',
    options: ['projects', 'users', 'services', 'jobs'],
    group: 'Фичи',
    order: 3,
  })
  entityFeatures?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @UiSchema({
    label: 'Фичи модулей',
    widget: 'checkbox',
    options: ['email', 'integrations'],
    group: 'Фичи',
    order: 4,
  })
  modulesFeatures?: string[];
}

export class ContactsDto {
  @IsOptional()
  @IsString()
  @UiSchema({ label: 'Название компании', placeholder: 'ООО "Мой бизнес"', group: 'Контакты', order: 1 })
  companyName?: string;

  @IsOptional()
  @IsString()
  @UiSchema({ label: 'ИНН', placeholder: '1234567890', group: 'Контакты', order: 2 })
  inn?: string;

  @IsOptional()
  @IsString()
  @UiSchema({ label: 'Телефон', placeholder: '+7 (999) 123-45-67', group: 'Контакты', order: 3 })
  phone?: string;

  @IsOptional()
  @IsString()
  @UiSchema({ label: 'Email', placeholder: 'info@company.com', group: 'Контакты', order: 4 })
  email?: string;
}

export class SocialLinksDto {
  @IsOptional()
  @IsString()
  @UiSchema({ label: 'Telegram', placeholder: 'https://t.me/yourchannel', group: 'Соцсети', order: 1 })
  telegram?: string;

  @IsOptional()
  @IsString()
  @UiSchema({ label: 'WhatsApp', placeholder: 'https://wa.me/79991234567', group: 'Соцсети', order: 2 })
  whatsapp?: string;

  @IsOptional()
  @IsString()
  @UiSchema({ label: 'Instagram', placeholder: 'https://instagram.com/yourprofile', group: 'Соцсети', order: 3 })
  instagram?: string;

  @IsOptional()
  @IsString()
  @UiSchema({ label: 'VK', placeholder: 'https://vk.com/yourprofile', group: 'Соцсети', order: 4 })
  vk?: string;

  @IsOptional()
  @IsString()
  @UiSchema({ label: 'Facebook', placeholder: 'https://facebook.com/yourprofile', group: 'Соцсети', order: 5 })
  facebook?: string;

  @IsOptional()
  @IsString()
  @UiSchema({ label: 'YouTube', placeholder: 'https://youtube.com/yourchannel', group: 'Соцсети', order: 6 })
  youtube?: string;

  @IsOptional()
  @IsString()
  @UiSchema({ label: 'TikTok', placeholder: 'https://tiktok.com/@yourprofile', group: 'Соцсети', order: 7 })
  tiktok?: string;

  @IsOptional()
  @IsString()
  @UiSchema({ label: 'LinkedIn', placeholder: 'https://linkedin.com/in/yourprofile', group: 'Соцсети', order: 8 })
  linkedin?: string;
}

export class TemplateDto {
  @IsString()
  @UiSchema({
    label: 'Шаблон',
    placeholder: 'default',
    options: ['default'],
    widget: 'select',
    group: '',
    order: 1,
  })
  name: string;
}

export class ThemeSettingsDto {
  @IsOptional()
  @IsString()
  @UiSchema({ label: 'Основной цвет', placeholder: '#000000', group: '', order: 1 })
  primaryColor?: string;

  @IsOptional()
  @IsString()
  @UiSchema({ label: 'Дополнительный цвет', placeholder: '#ffffff', group: '', order: 2 })
  secondaryColor?: string;

  @IsOptional()
  @IsString()
  @UiSchema({ label: 'Акцентный цвет', placeholder: '#ff0000', group: '', order: 3 })
  accentColor?: string;
}

export class FontSettingsDto {
  @IsOptional()
  @IsString()
  @UiSchema({ label: 'Основной шрифт', placeholder: 'Roboto', group: '', order: 1 })
  primary?: string;

  @IsOptional()
  @IsString()
  @UiSchema({ label: 'Дополнительный шрифт', placeholder: 'Arial', group: '', order: 2 })
  secondary?: string;
}

export class SiteSettingsDto {
  /** ✅ FIX: было Type(() => ThemeSettingsDto) */
  @IsOptional()
  @ValidateNested()
  @Type(() => TemplateDto)
  @UiSchema({ label: 'Шаблон', widget: 'object', group: '', order: 1, dto: TemplateDto })
  template?: TemplateDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ThemeSettingsDto)
  @UiSchema({ label: 'Цветовая тема', widget: 'object', group: '', order: 2, dto: ThemeSettingsDto })
  theme?: ThemeSettingsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => FontSettingsDto)
  @UiSchema({ label: 'Шрифты', widget: 'object', group: '', order: 3, dto: FontSettingsDto })
  fonts?: FontSettingsDto;
}

export class SeoDto {
  @IsOptional()
  @IsString()
  @UiSchema({ label: 'SEO: Заголовок по умолчанию', group: 'SEO', order: 1 })
  defaultTitle?: string;

  @IsOptional()
  @IsString()
  @UiSchema({ label: 'SEO: Описание по умолчанию', widget: 'textarea', group: 'SEO', order: 2 })
  defaultDescription?: string;
}

/** Адрес */
export class AddressDto implements Address {
  @IsOptional()
  @IsString()
  @UiSchema({ label: 'Улица', placeholder: 'ул. Ленина, 10', group: 'Адрес', order: 1 })
  street?: string;

  @IsOptional()
  @IsString()
  @UiSchema({ label: 'Город', placeholder: 'Москва', group: 'Адрес', order: 2 })
  city?: string;

  @IsOptional()
  @IsString()
  @UiSchema({ label: 'Регион', placeholder: 'Московская область', group: 'Адрес', order: 3 })
  region?: string;

  @IsOptional()
  @IsString()
  @UiSchema({ label: 'Почтовый индекс', placeholder: '101000', group: 'Адрес', order: 4 })
  zip?: string;

  @IsOptional()
  @IsString()
  @UiSchema({ label: 'Страна', placeholder: 'Россия', group: 'Адрес', order: 5 })
  country?: string;
}

/** Поле сущности */
export class EntityFieldDto {
  @IsString()
  @UiSchema({ label: 'Название поля', placeholder: 'title', group: 'Сущность: Поле', order: 1 })
  name: string;

  @IsString()
  @UiSchema({
    label: 'Тип поля',
    widget: 'select',
    options: ['string', 'number', 'boolean', 'date'],
    group: 'Сущность: Поле',
    order: 2,
  })
  type: string;

  @IsOptional()
  @IsBoolean()
  @UiSchema({ label: 'Обязательное?', widget: 'checkbox', group: 'Сущность: Поле', order: 3 })
  required?: boolean;

  @IsOptional()
  @IsObject()
  @UiSchema({ label: 'Опции', widget: 'json', group: 'Сущность: Поле', order: 4 })
  options?: Record<string, any>;
}

/** Схема сущности */
export class EntitySchemaDto implements EntitySchema {
  @IsString()
  @UiSchema({ label: 'Название сущности', placeholder: 'Product', group: 'Сущность', order: 1 })
  name: string;

  @IsString()
  @UiSchema({ label: 'Слаг сущности', placeholder: 'product', group: 'Сущность', order: 2 })
  slug: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EntityFieldDto)
  @UiSchema({ label: 'Поля', widget: 'array', group: 'Сущность', order: 3 })
  fields: EntityFieldDto[];

  @IsOptional()
  @IsObject()
  @UiSchema({ label: 'Опции', widget: 'json', group: 'Сущность', order: 4 })
  options?: Record<string, any>;
}

/** Mongo DB config */
export class MongoDbConfigDto {
  @IsString()
  @UiSchema({ label: 'Mongo URI', placeholder: 'mongodb://localhost:27017', group: '', order: 1, widget: 'textarea' })
  uri: string;

  @IsString()
  @UiSchema({ label: 'Mongo название БД', placeholder: 'mydb', group: '', order: 2, widget: 'input' })
  name: string;
}

export class DbConfigDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => MongoDbConfigDto)
  @UiSchema({ label: 'MongoDB', widget: 'object', group: 'Базы данных', order: 1, dto: MongoDbConfigDto })
  mongo?: MongoDbConfigDto;
}

/** DTO проекта */
export class CreateProjectDto {
  @IsMongoId()
  @UiSchema({ label: 'Владелец', widget: 'entity', entity: 'user', group: 'Связи', order: 1 })
  owner: string;

  @IsOptional()
  @IsString()
  @UiSchema({ label: 'URL', placeholder: 'https://myproject.com', group: 'Основное', order: 2 })
  url?: string;

  @IsString()
  @UiSchema({ label: 'Slug', placeholder: 'my-project', group: 'Основное', order: 3 })
  slug: string;

  @IsString()
  @UiSchema({ label: 'Название проекта', placeholder: 'Мой проект', group: 'Основное', order: 4 })
  name: string;

  @IsOptional()
  @IsString()
  @UiSchema({ label: 'Описание', widget: 'textarea', placeholder: 'Описание проекта', group: 'Основное', order: 5 })
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @UiSchema({
    label: 'Домены (hostnames)',
    widget: 'tags',
    placeholder: 'example.com, localhost',
    group: 'Домены',
    order: 1,
  })
  domains?: string[];

  @IsOptional()
  @IsString()
  @UiSchema({ label: 'Primary domain', placeholder: 'example.com', group: 'Домены', order: 2 })
  primaryDomain?: string;

  @IsOptional()
  @IsString()
  @UiSchema({ label: 'Template ID', placeholder: 'landing-default', group: 'Шаблон/Тема', order: 1 })
  templateId?: string;

  @IsOptional()
  @IsString()
  @UiSchema({ label: 'Theme ID', placeholder: 'beauty', group: 'Шаблон/Тема', order: 2 })
  themeId?: string;

  @IsOptional()
  @IsObject()
  @UiSchema({
    label: 'Theme overrides (CSS vars)',
    widget: 'json',
    group: 'Шаблон/Тема',
    order: 3,
  })
  themeOverrides?: Record<string, string>;

  @IsOptional()
  @ValidateNested()
  @Type(() => SeoDto)
  @UiSchema({ label: 'SEO', widget: 'object', group: 'SEO', order: 1, dto: SeoDto })
  seo?: SeoDto;

  @IsOptional()
  @IsString()
  @UiSchema({ label: 'Превью', placeholder: 'https://example.com/preview.png', group: 'Медиа', widget: 'image', order: 1 })
  preview?: string;

  @IsOptional()
  @IsString()
  @UiSchema({ label: 'Логотип', placeholder: 'https://example.com/logo.png', group: 'Медиа', widget: 'image', order: 2 })
  logo?: string;

  @IsOptional()
  @IsString()
  @UiSchema({ label: 'Логотип круглый', placeholder: 'https://example.com/logo-small.png', group: 'Медиа', widget: 'image', order: 3 })
  logoSmall?: string;

  @IsEnum(ProjectType)
  @UiSchema({
    label: 'Тип проекта',
    widget: 'select',
    placeholder: 'Выберите тип',
    options: Object.values(ProjectType),
    group: 'Основное',
    order: 6,
  })
  type: ProjectType;

  @IsOptional()
  @IsEnum(ProjectStatus)
  @UiSchema({
    label: 'Статус',
    widget: 'select',
    placeholder: 'Выберите статус',
    options: Object.values(ProjectStatus),
    group: 'Основное',
    order: 7,
  })
  status?: ProjectStatus;

  @IsOptional()
  @ValidateNested()
  @Type(() => ProjectFeaturesDto)
  @UiSchema({ label: 'Фичи', widget: 'object', group: 'Фичи', order: 1, dto: ProjectFeaturesDto })
  features?: ProjectFeaturesDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => DbConfigDto)
  @UiSchema({ label: 'Базы данных', widget: 'object', group: 'Базы данных', order: 1, dto: DbConfigDto })
  db?: DbConfigDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => SiteSettingsDto)
  @UiSchema({ label: 'Настройки сайта', widget: 'object', group: 'Настройки', order: 2, dto: SiteSettingsDto })
  siteSettings?: SiteSettingsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ContactsDto)
  @UiSchema({ label: 'Контакты', widget: 'object', group: 'Контакты', order: 1, dto: ContactsDto })
  contacts?: ContactsDto;

  /** ✅ FIX: было Type(() => ContactsDto) */
  @IsOptional()
  @ValidateNested()
  @Type(() => SocialLinksDto)
  @UiSchema({ label: 'Ссылки на соцсети', widget: 'object', group: 'Ссылки на соцсети', order: 1, dto: SocialLinksDto })
  socialLinks?: SocialLinksDto;

  /** ✅ FIX: было Type(() => ContactsDto) + dto: AddressDto */
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  @UiSchema({ label: 'Адрес', widget: 'object', group: 'Адрес', order: 1, dto: AddressDto })
  address?: AddressDto;

  @IsOptional()
  @IsBoolean()
  @UiSchema({ label: 'Демо проект?', widget: 'radio', group: 'Флаги', order: 1 })
  isDemo?: boolean;

  @IsOptional()
  @IsBoolean()
  @UiSchema({ label: 'Архивирован?', widget: 'radio', group: 'Флаги', order: 2 })
  isArchived?: boolean;
}

export class UpdateProjectDto extends PartialType(CreateProjectDto) {}
