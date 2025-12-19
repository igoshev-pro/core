import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { File, FileDocument, FileSchema } from './entities/file.entity';
import { FileTokenUtil } from './file-token.util';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuid } from 'uuid';
import * as sharp from 'sharp';
import * as heicConvert from 'heic-convert';
import { TenantMongoService } from 'src/core/tenant/tenant-mongo.service';

@Injectable()
export class FileService {
  private fileModel: Model<FileDocument>;
  private cloudPath = path.resolve(process.cwd(), 'cloud');

  async initModel() {
    if (!this.fileModel) {
      this.fileModel = await this.tenantMongo.getModel<FileDocument>(
        File.name,
        FileSchema,
      );
    }
  }

  constructor(
    private readonly tenantMongo: TenantMongoService,
    private readonly fileTokenUtil: FileTokenUtil,
  ) {}

  async saveFiles(
    files: Express.Multer.File[],
    ownerId: string,
  ): Promise<string[]> {
    if (!files || files.length === 0)
      throw new BadRequestException('Нет файлов для загрузки');

    const tokens: string[] = [];

    for (const file of files) {
      const token = await this.processAndSaveFile(file, ownerId);
      tokens.push(token);
    }

    return tokens;
  }

  private async processAndSaveFile(
    file: Express.Multer.File,
    ownerId: string,
  ): Promise<string> {
    await this.initModel();

    const id = uuid();
    let fileBuffer = file.buffer;
    let type = file.mimetype.split('/')[0];
    let ext = path.extname(file.originalname).toLowerCase().replace('.', '');

    // ✅ HEIC → webp
    if (ext === 'heic') {
      const outputBuffer = await heicConvert({
        buffer: fileBuffer,
        format: 'JPEG',
        quality: 1,
      });
      fileBuffer = await sharp(outputBuffer).webp({ quality: 85 }).toBuffer();
      ext = 'webp';
      type = 'image';
    }
    // ✅ Конвертация изображений в webp
    else if (type === 'image' && ext !== 'webp') {
      fileBuffer = await sharp(fileBuffer).webp({ quality: 85 }).toBuffer();
      ext = 'webp';
    }

    // ✅ Создание папки
    const dir = path.join(this.cloudPath, ownerId, type);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const filename = `${id}.${ext}`;
    fs.writeFileSync(path.join(dir, filename), fileBuffer);

    // ✅ Создание токена
    const token = this.fileTokenUtil.generateFileToken(id, ownerId);

    // ✅ Сохранение в Mongo
    await this.fileModel.create({
      ownerId,
      type,
      filename,
      size: fileBuffer.length,
      token,
    });

    return token;
  }

  // ✅ Получение информации о файле по токену
  async getFileByToken(token: string) {
    await this.initModel();

    const payload = this.fileTokenUtil.verifyFileToken(token);
    const file = await this.fileModel.findOne({ token }).lean();

    if (!file) throw new NotFoundException('Файл не найден');
    if (file.ownerId !== payload.ownerId)
      throw new ForbiddenException('Нет доступа к файлу');

    return file;
  }

  // ✅ Получение пути к файлу для скачивания
  async getFilePathByToken(
    token: string,
  ): Promise<{ file: FileDocument; path: string }> {
    const file = await this.getFileByToken(token);
    const filePath = path.join(
      this.cloudPath,
      file.ownerId,
      file.type,
      file.filename,
    );

    if (!fs.existsSync(filePath))
      throw new NotFoundException('Файл отсутствует на диске');

    return { file: file as FileDocument, path: filePath };
  }

  async deleteFileByToken(token: string) {
    await this.initModel();

    const file = await this.fileModel.findOne({ token });
    if (!file) return;

    const filePath = path.join(
      this.cloudPath,
      file.ownerId,
      file.type,
      file.filename,
    );
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await this.fileModel.deleteOne({ _id: file._id });
  }
}
