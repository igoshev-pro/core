import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { LayoutsService } from './layouts.service';
import { CreateLayoutDto } from './dto/create-layout.dto';
import { UpdateLayoutDto } from './dto/update-layout.dto';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { SuperAdminGuard } from 'src/core/auth/guards/super-admin.guard';

@UseGuards(JwtAuthGuard, SuperAdminGuard)
@Controller('/factory/layouts')
export class LayoutsController {
  constructor(private readonly layoutsService: LayoutsService) {}

  @Post()
  create(@Body() createLayoutDto: CreateLayoutDto) {
    return this.layoutsService.create(createLayoutDto);
  }

  @Get()
  findAll(@Query() query: Record<string, string>) {
    return this.layoutsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.layoutsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLayoutDto: UpdateLayoutDto) {
    return this.layoutsService.update(id, updateLayoutDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.layoutsService.remove(id);
  }
}