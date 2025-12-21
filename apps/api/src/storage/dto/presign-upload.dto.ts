import { IsString, IsOptional, IsInt, Min } from 'class-validator';

export class PresignUploadDto {
  @IsString()
  path!: string; // например "avatars/user-1.png"

  @IsString()
  contentType!: string; // например "image/png"

  @IsOptional()
  @IsInt()
  @Min(1)
  expiresInSec?: number; // по умолчанию 300
}
