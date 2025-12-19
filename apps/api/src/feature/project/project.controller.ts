import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { JwtGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';
import { Me } from '../auth/me.decorator';
import { UserRole } from '../user/user.entity';
import { AutoDeleteOldFile } from '../file/auto-delete-old-file.decorator';
import { AutoDeleteOldFileInterceptor } from '../file/auto-delete-old-file.interceptor';
import { SuperAdminGuard } from '../auth/superadmin.guard';
import type { CreateProjectDto, UpdateProjectDto } from './project.dto';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @UseGuards(JwtGuard, AdminGuard)
  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(createProjectDto);
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Get()
  findAll(@Query() query: Record<string, string>, @Me() user: any) {
    if (user.role !== UserRole.SuperAdmin) {
      query.owner = user.sub; // добавляем owner = user.sub
    }
    return this.projectService.findAll(query);
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(id);
  }

  @UseGuards(JwtGuard, SuperAdminGuard)
  @Patch(':id')
  @AutoDeleteOldFile('preview', 'logo')
  @UseInterceptors(AutoDeleteOldFileInterceptor)
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(id, updateProjectDto);
  }

  @UseGuards(JwtGuard, SuperAdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectService.remove(id);
  }
}
