import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { JwtGuard } from '../auth/guards/jwt.guard'
import { SuperAdminGuard } from '../auth/guards/super-admin.guard'

@UseGuards(JwtGuard, SuperAdminGuard)
@Controller('core/clients')
export class ClientsController {
  constructor(private readonly ClientsService: ClientsService) {}

  @Post()
  create(@Body() createClientDto: CreateClientDto) {
    return this.ClientsService.create(createClientDto);
  }

  @Get()
  findAll(@Query() query: Record<string, string>) {
    return this.ClientsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ClientsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.ClientsService.update(id, updateClientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ClientsService.remove(id);
  }
}
