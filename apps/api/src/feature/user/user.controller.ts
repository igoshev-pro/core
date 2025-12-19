import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import type { Currency } from './user.entity';
import { AutoDeleteOldFile } from '../file/auto-delete-old-file.decorator';
import { AutoDeleteOldFileInterceptor } from '../file/auto-delete-old-file.interceptor';
import { JwtGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';
import type { CreateUserDto, UpdateUserDto } from './user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtGuard, AdminGuard)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll(@Query() query: Record<string, string>) {
    return this.userService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  @AutoDeleteOldFile('avatar')
  @UseInterceptors(AutoDeleteOldFileInterceptor)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  // ✅ Добавлено: метод для изменения баланса
  @UseGuards(JwtGuard, AdminGuard)
  @Post(':id/balance')
  async updateBalance(
    @Param('id') id: string,
    @Body() body: { amount: number; currency: Currency },
  ) {
    if (!body.currency || typeof body.amount !== 'number') {
      throw new BadRequestException('Укажите корректную сумму и валюту');
    }

    return this.userService.addBalance(id, body.amount, body.currency);
  }
}
