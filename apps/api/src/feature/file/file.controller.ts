import {
  Controller,
  Get,
  Header,
  Post,
  Query,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { Me } from '../auth/me.decorator';
import { JwtGuard } from '../auth/jwt.guard';
import { Response } from 'express';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @UseGuards(JwtGuard)
  @Post('upload')
  @UseInterceptors(AnyFilesInterceptor())
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Me() user: any,
  ) {
    const tokens = await this.fileService.saveFiles(files, user.sub);
    return { tokens };
  }

  // ✅ Получение информации о файле по токену
  @Get('info')
  async getFileInfo(@Query('token') token: string) {
    return this.fileService.getFileByToken(token);
  }

  // ✅ Скачивание файла по токену
  @Get('download')
  @Header('Content-Type', 'application/octet-stream')
  async downloadFile(@Query('token') token: string, @Res() res: Response) {
    const { file, path } = await this.fileService.getFilePathByToken(token);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${file.filename}"`,
    );
    return res.sendFile(path);
  }

  // ✅ Просмотр файла inline (для изображений и пр.)
  @Get('view')
  async viewFile(@Query('token') token: string, @Res() res: Response) {
    const { file, path } = await this.fileService.getFilePathByToken(token);
    res.setHeader('Content-Type', this.getMimeType(file.filename));
    return res.sendFile(path);
  }

  private getMimeType(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    const map: Record<string, string> = {
      webp: 'image/webp',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      pdf: 'application/pdf',
    };
    return map[ext] || 'application/octet-stream';
  }
}

// запросы к файлам
// Получить метаданные файла:
// GET /file/info?token=<file-token>
// Скачать файл:
// GET /file/download?token=<file-token>
// Просмотреть файл inline (например, изображение):
// GET /file/view?token=<file-token>
