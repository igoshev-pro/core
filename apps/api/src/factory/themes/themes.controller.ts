import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { SuperAdminGuard } from 'src/core/auth/guards/super-admin.guard';
import { ThemesService } from './themes.service';
import { CreateThemeDto } from './dto/create-theme.dto';
import { UpdateThemeDto } from './dto/update-theme.dto';

@UseGuards(JwtAuthGuard, SuperAdminGuard)
@Controller('/factory/themes')
export class ThemesController {
  constructor(private readonly themesService: ThemesService) {}

  @Post()
  create(@Body() createTemplateDto: CreateThemeDto) {
    return this.themesService.create(createTemplateDto);
  }

  @Get()
  findAll(@Query() query: Record<string, string>) {
    return this.themesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.themesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTemplateDto: UpdateThemeDto) {
    return this.themesService.update(id, updateTemplateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.themesService.remove(id);
  }
}
