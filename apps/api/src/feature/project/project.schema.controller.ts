import { Controller, Get } from '@nestjs/common';
import { generateSchemaFromDto } from 'src/common/utils/schema-generator.util';
import { CreateProjectDto } from './project.dto';

@Controller('schema')
export class ProjectSchemaController {
  @Get('project')
  getProjectSchema() {
    return generateSchemaFromDto(CreateProjectDto);
  }
}
