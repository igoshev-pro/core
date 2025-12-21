import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { SuperAdminsService } from './super-admins.service';
import { CreateSuperAdminDto } from './dto/create-super-admin.dto';
import { UpdateSuperAdminDto } from './dto/update-super-admin.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { SuperAdminGuard } from '../auth/guards/super-admin.guard'
import { Me } from '../auth/me.decorator';

@UseGuards(JwtAuthGuard, SuperAdminGuard)
@Controller('super-admins')
export class SuperAdminsController {
  constructor(private readonly superAdminsService: SuperAdminsService) { }

  @Post()
  create(@Body() createSuperAdminDto: CreateSuperAdminDto) {
    return this.superAdminsService.create(createSuperAdminDto);
  }

  @Get()
  findAll(@Query() query: Record<string, string>) {
    return this.superAdminsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.superAdminsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSuperAdminDto: UpdateSuperAdminDto) {
    return this.superAdminsService.update(id, updateSuperAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.superAdminsService.remove(id);
  }

  @Get('get/me')
  getProfile(@Me() user: any) {
    return this.superAdminsService.findOne(user?.sub);
  }
}
