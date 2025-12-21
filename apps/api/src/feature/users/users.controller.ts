import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { TenantGuard } from 'src/core/auth/guards/tenant.guard';
import { ClientGuard } from 'src/core/clients/client.guard';

@UseGuards(JwtAuthGuard, TenantGuard)
@Controller('users')
export class UsersController {
  // constructor(private readonly UsersService: UsersService) {}

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.UsersService.create(createUserDto);
  // }

  // @UseGuards(ClientGuard)
  // @Get()
  // findAll(@Query() query: Record<string, string>) {
  //   return this.UsersService.findAll(query);
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.UsersService.findOne(id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.UsersService.update(id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.UsersService.remove(id);
  // }
}
