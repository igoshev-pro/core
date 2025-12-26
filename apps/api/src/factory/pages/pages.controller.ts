import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { SuperAdminGuard } from 'src/core/auth/guards/super-admin.guard';
import { PagesService } from './pages.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';

@UseGuards(JwtAuthGuard, SuperAdminGuard)
@Controller('/factory/Pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Post()
  create(@Body() createPageDto: CreatePageDto) {
    return this.pagesService.create(createPageDto);
  }

  @Get()
  findAll(@Query() query: Record<string, string>) {
    return this.pagesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pagesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePageDto: UpdatePageDto) {
    return this.pagesService.update(id, updatePageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pagesService.remove(id);
  }
}