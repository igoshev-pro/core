import { IsString, MinLength } from 'class-validator';

export class ResolveDomainQueryDto {
  @IsString()
  @MinLength(1)
  host!: string;
}

export type ResolveDomainResponse =
  | { ok: true; projectId: string; status: 'active' | 'disabled' | 'draft' }
  | { ok: true; projectId: string; status: 'active' | 'disabled' | 'draft', i18n: any }
  | { ok: false; code: 'NOT_FOUND' | 'DISABLED' };
