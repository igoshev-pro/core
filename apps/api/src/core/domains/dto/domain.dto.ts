import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ProjectStatus } from '../../projects/project.enum';

export class DomainDto {
  @IsString()
  host?: string;

  @IsOptional()
  @IsString()
  projectId?: string;

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;
}