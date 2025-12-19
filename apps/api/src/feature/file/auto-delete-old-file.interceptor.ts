// interceptors/auto-delete-old-file.interceptor.ts
import {
  Injectable,
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  Inject,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AUTO_DELETE_OLD_FILE } from './auto-delete-old-file.decorator';
import { FileService } from './file.service';

@Injectable()
export class AutoDeleteOldFileInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AutoDeleteOldFileInterceptor.name);

  constructor(
    private readonly reflector: Reflector,
    @Inject(FileService) private readonly fileService: FileService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const fields = this.reflector.get<string[]>(
      AUTO_DELETE_OLD_FILE,
      context.getHandler(),
    );
    if (!fields || fields.length === 0) return next.handle();

    const request = context.switchToHttp().getRequest();
    const body = request.body;

    return next.handle().pipe(
      tap(async (updatedEntity) => {
        try {
          for (const field of fields) {
            const oldValue = updatedEntity[`_${field}`] || updatedEntity[field];
            const newValue = body[field];

            // Если поле массив
            if (Array.isArray(oldValue) && Array.isArray(newValue)) {
              const removedTokens = oldValue.filter(
                (token) => !newValue.includes(token),
              );
              for (const token of removedTokens) {
                await this.fileService.deleteFileByToken(token);
                this.logger.log(
                  `Удален старый файл из массива "${field}": ${token}`,
                );
              }
            }

            // Если поле одиночное (строка)
            else if (typeof oldValue === 'string' && oldValue !== newValue) {
              await this.fileService.deleteFileByToken(oldValue);
              this.logger.log(
                `Удален старый файл по полю "${field}": ${oldValue}`,
              );
            }
          }
        } catch (err) {
          this.logger.error(`Ошибка при удалении файлов: ${err.message}`);
        }
      }),
    );
  }
}
