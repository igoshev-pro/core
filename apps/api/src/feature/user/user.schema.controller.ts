import { Controller, Get } from '@nestjs/common';
import { generateSchemaFromDto } from 'src/common/utils/schema-generator.util';
import { CreateUserDto } from './user.dto';

@Controller('schema')
export class UserSchemaController {
  @Get('user')
  getProjectSchema() {
    return generateSchemaFromDto(CreateUserDto);
  }
}
