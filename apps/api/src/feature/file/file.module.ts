import { Global, Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { FileTokenUtil } from './file-token.util';

@Global()
@Module({
  controllers: [FileController],
  providers: [FileService, FileTokenUtil],
  exports: [FileService, FileTokenUtil],
})
export class FileModule {}
