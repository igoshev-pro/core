import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { PageService } from './page.service';
import { CreatePageDto, UpdatePageDto } from './page.dto';
import { JwtGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';
import { AutoDeleteOldFile } from '../file/auto-delete-old-file.decorator';
import { AutoDeleteOldFileInterceptor } from '../file/auto-delete-old-file.interceptor';
import { SuperAdminGuard } from '../auth/superadmin.guard';

@UseGuards(JwtGuard, AdminGuard)
@Controller('page')
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @UseGuards(SuperAdminGuard)
  @Post()
  create(@Body() createPageDto: CreatePageDto) {
    return this.pageService.create(createPageDto);
  }

  @Get()
  findAll(@Query() query: Record<string, string>) {
    return this.pageService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pageService.findOne(id);
  }

  @Patch(':id')
  @AutoDeleteOldFile('preview', 'ogImage')
  @UseInterceptors(AutoDeleteOldFileInterceptor)
  update(@Param('id') id: string, @Body() updatePageDto: UpdatePageDto) {
    return this.pageService.update(id, updatePageDto);
  }

  @UseGuards(SuperAdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pageService.remove(id);
  }
}
