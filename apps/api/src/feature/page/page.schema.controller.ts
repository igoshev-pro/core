import { Controller, Get } from '@nestjs/common';
import { generateSchemaFromDto } from 'src/common/utils/schema-generator.util';
import { CreatePageDto } from './page.dto';

@Controller('schema')
export class PageSchemaController {
  @Get('page')
  getPageSchema() {
    return generateSchemaFromDto(CreatePageDto);
  }
}
