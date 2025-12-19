import { Controller, Get } from '@nestjs/common';
import { CreateProjectDto } from './project.dto';
import { generateSchemaFromDto } from 'src/common/utils/schema-generator.util';

@Controller('schema')
export class ProjectSchemaController {
  @Get('project')
  getProjectSchema() {
    return generateSchemaFromDto(CreateProjectDto);
  }
}
