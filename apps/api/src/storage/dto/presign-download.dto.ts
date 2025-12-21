import { IsString, IsOptional, IsInt, Min } from 'class-validator';

export class PresignDownloadDto {
  @IsString()
  path!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  expiresInSec?: number;
}
