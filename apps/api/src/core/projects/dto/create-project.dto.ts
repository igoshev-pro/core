import { IsOptional, IsString, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class MongoDbDto {
  @IsOptional()
  @IsString()
  uri?: string;

  @IsOptional()
  @IsString()
  name?: string;
}

class DbConfigDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => MongoDbDto)
  mongo?: MongoDbDto;
}

class TemplateConfigDto {
  @IsOptional()
  @IsString()
  public?: string;

  @IsOptional()
  @IsString()
  admin?: string;
}

class ThemeConfigDto {
  @IsOptional()
  @IsString()
  public?: string;

  @IsOptional()
  @IsString()
  admin?: string;
}

class SeoDefaultsDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  ogImage?: string;
}

/**
 * ⚠️ Schema intentionally left as "any"
 * т.к. это runtime-конфиг рендера,
 * валидацию ты сделаешь позже на уровне schema editor
 */
class SiteConfigDto {
  @IsOptional()
  @IsObject()
  public?: Record<string, any>;

  @IsOptional()
  @IsObject()
  admin?: Record<string, any>;
}

export class CreateProjectDto {
  @IsOptional()
  @IsString()
  domainTech?: string;

  @IsOptional()
  @IsString()
  domainCustom?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  owner?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => DbConfigDto)
  db?: DbConfigDto;

  // 🔥 НОВОЕ
  @IsOptional()
  @ValidateNested()
  @Type(() => TemplateConfigDto)
  template?: TemplateConfigDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ThemeConfigDto)
  theme?: ThemeConfigDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => SeoDefaultsDto)
  seoDefaults?: SeoDefaultsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => SiteConfigDto)
  site?: SiteConfigDto;
}
