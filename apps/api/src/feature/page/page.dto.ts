import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  IsNumber,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { UiSchema } from '../../common/decorators/ui-schema.decorator';
import { PageType } from './page.entity';

/** SEO DTO */
export class PageSeoDto {
  @IsOptional()
  @IsString()
  @UiSchema({
    label: 'Title',
    placeholder: 'Заголовок страницы для SEO',
    group: 'SEO',
    order: 1,
  })
  title?: string;

  @IsOptional()
  @IsString()
  @UiSchema({
    label: 'Description',
    widget: 'textarea',
    placeholder: 'Краткое описание страницы',
    group: 'SEO',
    order: 2,
  })
  description?: string;

  @IsOptional()
  @IsString()
  @UiSchema({
    label: 'Keywords',
    placeholder: 'keyword1, keyword2',
    group: 'SEO',
    order: 3,
  })
  keywords?: string;

  @IsOptional()
  @IsString()
  @UiSchema({
    label: 'OG Image',
    widget: 'image',
    placeholder: 'https://example.com/og.png',
    group: 'SEO',
    order: 4,
  })
  ogImage?: string;
}

/** Элемент массива ссылок на секции (entity select в массиве объектов) */
export class PageSectionRefDto {
  @IsString()
  @UiSchema({
    label: 'Секция',
    widget: 'entity',
    entity: 'section',
    placeholder: 'Выберите секцию',
    group: '',
    order: 1,
  })
  section: string;
}

/** DTO создания страницы */
export class CreatePageDto {
  // ===== Основное =====
  @IsString()
  @UiSchema({
    label: 'Заголовок',
    placeholder: 'О компании',
    group: 'Основное',
    order: 1,
  })
  title: string;

  @IsString()
  @UiSchema({
    label: 'Slug',
    placeholder: 'about-us',
    group: 'Основное',
    order: 2,
  })
  slug: string;

  @IsOptional()
  @IsEnum(PageType)
  @UiSchema({
    label: 'Тип',
    widget: 'select',
    placeholder: 'Выберите тип',
    options: Object.values(PageType),
    group: 'Основное',
    order: 3,
  })
  status?: PageType;

  @IsOptional()
  @IsString()
  @UiSchema({
    label: 'Шаблон',
    widget: 'select',
    options: ['default'],
    placeholder: 'Выберите шаблон',
    group: 'Основное',
    order: 4,
  })
  template?: string;

  @IsString()
  @UiSchema({
    label: 'Путь',
    placeholder: '/page',
    group: 'Основное',
    order: 5,
  })
  path: string;

  // ===== SEO (вложенный объект) =====
  @IsOptional()
  @ValidateNested()
  @Type(() => PageSeoDto)
  @UiSchema({
    label: 'SEO',
    widget: 'object',
    group: 'SEO',
    order: 1,
    dto: PageSeoDto,
  })
  seo?: PageSeoDto;

  // ===== Флаги =====
  @IsOptional()
  @IsBoolean()
  @UiSchema({
    label: 'Опубликовано?',
    widget: 'radio',
    group: 'Флаги',
    order: 1,
  })
  isVisible?: boolean;

  @IsOptional()
  @IsBoolean()
  @UiSchema({
    label: 'Главная?',
    widget: 'radio',
    group: 'Флаги',
    order: 2,
  })
  isHome?: boolean;

  @IsOptional()
  @IsBoolean()
  @UiSchema({
    label: 'С авторизацией?',
    widget: 'radio',
    group: 'Флаги',
    order: 3,
  })
  isProtected?: boolean;

  // ===== Порядок / структура =====
  @IsOptional()
  @IsNumber()
  @UiSchema({
    label: 'Порядок',
    placeholder: '0',
    group: 'Структура',
    order: 1,
    widget: 'input',
  })
  order?: number;

  @IsOptional()
  @IsString()
  @UiSchema({
    label: 'Родительская страница',
    widget: 'entity',
    entity: 'page',
    placeholder: 'Выберите родителя',
    group: 'Структура',
    order: 2,
  })
  parent?: string | null;

  // ===== Публикация =====
  // @IsOptional()
  // @IsDate()
  // @Type(() => Date)
  // @UiSchema({
  //   label: 'Дата публикации',
  //   widget: 'hidden',
  //   group: 'Публикация',
  //   order: 1,
  // })
  // publishAt?: Date | null;

  // @IsOptional()
  // @IsDate()
  // @Type(() => Date)
  // @UiSchema({
  //   label: 'Дата снятия с публикации',
  //   widget: 'hidden',
  //   group: 'Публикация',
  //   order: 2,
  // })
  // unpublishAt?: Date | null;

  // ===== Метки =====
  // @IsOptional()
  // @IsArray()
  // @IsString({ each: true })
  // @UiSchema({
  //   label: 'Теги',
  //   widget: 'tags',
  //   group: 'Метки',
  //   order: 1,
  // })
  // tags?: string[];

  // ===== Секции (array of entity refs через вложенный DTO) =====
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PageSectionRefDto)
  @UiSchema({
    label: 'Секции',
    widget: 'array',
    group: 'Секции',
    order: 1,
    dto: PageSectionRefDto,
  })
  sections?: PageSectionRefDto[];

  // ===== Связи =====
  // @IsString()
  // @UiSchema({
  //   label: 'Проект',
  //   placeholder: 'Выберите проект',
  //   group: 'Связи',
  //   widget: 'entity',
  //   entity: 'project',
  //   order: 1,
  // })
  // project: string;

  // ===== Медиа =====
  @IsOptional()
  @IsString()
  @UiSchema({
    label: 'Превью',
    placeholder: 'https://example.com/avatar.png',
    group: 'Медиа',
    widget: 'image',
    order: 1,
  })
  avatar?: string;
}

export class UpdatePageDto extends PartialType(CreatePageDto) {}
