import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { StorageService } from './storage.service';
import { PresignUploadDto } from './dto/presign-upload.dto';
import { PresignDownloadDto } from './dto/presign-download.dto';
import { ProjectHeaderGuard } from '../../common/guards/project-header.guard';
import { ProjectId } from '../../common/decorators/project-id.decorator';

@Controller('storage')
@UseGuards(ProjectHeaderGuard)
export class StorageController {
  constructor(private readonly storage: StorageService) {}

  @Post('presign/upload')
  async presignUpload(@ProjectId() projectId: string, @Body() dto: PresignUploadDto) {
    return this.storage.presignUpload({
      projectId: projectId!,
      path: dto.path,
      contentType: dto.contentType,
      expiresInSec: dto.expiresInSec,
    });
  }

  @Post('presign/download')
  async presignDownload(@ProjectId() projectId: string, @Body() dto: PresignDownloadDto) {
    return this.storage.presignDownload({
      projectId: projectId!,
      path: dto.path,
      expiresInSec: dto.expiresInSec,
    });
  }
}

// 1) Получаем { url, fields, key }
// const presign = await fetch('/api/storage/presign/post', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//     'x-project-id': projectId,
//   },
//   body: JSON.stringify({
//     path: `uploads/${file.name}`,
//     contentType: file.type || 'application/octet-stream',
//   }),
// }).then(r => r.json());

// // 2) Собираем multipart/form-data
// const form = new FormData();
// Object.entries(presign.fields).forEach(([k, v]) => form.append(k, v as string));
// form.append('Content-Type', file.type || 'application/octet-stream');
// form.append('file', file);

// // 3) POST прямо в S3
// const res = await fetch(presign.url, {
//   method: 'POST',
//   body: form,
// });

// if (!res.ok) {
//   const text = await res.text().catch(() => '');
//   throw new Error(`Upload failed: ${res.status} ${text}`);
// }

// Получить файл
// Method: POST
// URL: http://localhost:3000/storage/presign/download
// Headers:
// Content-Type: application/json
// x-project-id: 694812cacc66d2769604e1b7
// Body (JSON):
// {
//   "path": "test/hello.png"
// }
