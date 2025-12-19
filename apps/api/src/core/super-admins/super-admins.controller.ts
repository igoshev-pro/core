import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SuperAdminsService } from './super-admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Controller('core/super-admins')
export class SuperAdminsController {
  constructor(private readonly superAdminsService: SuperAdminsService) {}

  // @Post()
  // create(@Body() createAdminDto: CreateAdminDto) {
  //   return this.superAdminsService.create(createAdminDto);
  // }

  // @Get()
  // findAll(@Query() query: Record<string, string>) {
  //   return this.superAdminsService.findAll(query);
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.superAdminsService.findOne(id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
  //   return this.superAdminsService.update(id, updateAdminDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.superAdminsService.remove(id);
  // }
}
