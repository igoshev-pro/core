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
import { CreateUserDto, Currency, UpdateUserDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  // ✅ Добавлено: метод для изменения баланса
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
