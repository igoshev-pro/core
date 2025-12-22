import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { Me } from '../auth/me.decorator'
import { UserRole } from 'src/common/enums/user.unum'
import { ClientGuard } from '../clients/client.guard';

// @UseGuards(JwtAuthGuard)
@Controller('core/projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  // @UseGuards(ClientGuard)
  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @UseGuards(ClientGuard)
  @Get()
  findAll(@Query() query: Record<string, string>, @Me() user: any) {
    if (user.role !== UserRole.SuperAdmin) {
      query.owner = user.sub
    }
    return this.projectsService.findAll(query);
  }

  @UseGuards(ClientGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @UseGuards(ClientGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @UseGuards(ClientGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}
