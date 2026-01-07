import { IsOptional, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class SiteLayoutDto {
  _id: string;
  type: string;
  layoutKey: string;
  slots?: Record<string, any[]>;
}

class SiteBlockDto {
  _id: string;
  type: 'widget' | 'section';
  key: string;
  props: any;
}

class PageAccessDto {
  auth?: boolean;
  roles?: string[];
  features?: string[];
  redirectTo?: string;
  permissions?: string[];
  all?: boolean;
  hideInMenuIfNoAccess?: boolean;
}

class SitePageDto {
  _id: string;
  name: string;
  path: string;
  kind: 'static' | 'dynamic';
  access?: PageAccessDto;
  blocks: SiteBlockDto[];
}

class SiteSectionDto {
  version?: string;

  @IsObject()
  layout: SiteLayoutDto;

  @ValidateNested({ each: true })
  @Type(() => SitePageDto)
  pages: SitePageDto[];
}

export class UpdateSiteSchemaDto {
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => SiteSectionDto)
  public?: SiteSectionDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => SiteSectionDto)
  admin?: SiteSectionDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => SiteSectionDto)
  login?: SiteSectionDto;
}
