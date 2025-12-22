import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { DomainsService } from './domains.service';
import { ResolveDomainQueryDto } from './dto/resolve-domain.dto';
import { SuperAdminGuard } from '../auth/guards/super-admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { DomainDto } from './dto/domain.dto'

@Controller('core/domains')
export class DomainsController {
  constructor(private readonly service: DomainsService) {}

  @Get('resolve')
  async resolve(
    @Query() query: ResolveDomainQueryDto,
    @Headers('x-internal-token') token?: string,
  ) {
    const expected = process.env.CORE_INTERNAL_TOKEN;
    if (expected && token !== expected) {
      throw new UnauthorizedException('Invalid internal token');
    }

    return this.service.resolve(query.host);
  }

  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  @Post()
  create(@Body() data: DomainDto) {
    return this.domainsService.create(domainDto);
  }

  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  @Get()
  findAll(@Query() query: Record<string, string>) {
    return this.domainsService.findAll(query);
  }

  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.domainsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: DomainDto) {
    return this.domainsService.update(id, updateClientDto);
  }

  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.domainsService.remove(id);
  }
}
