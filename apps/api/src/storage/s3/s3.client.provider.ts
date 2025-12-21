import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';
import { S3_CLIENT } from './s3.constants';

export const s3ClientProvider: Provider = {
  provide: S3_CLIENT,
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const endpoint = config.get<string>('S3_ENDPOINT');
    const region = config.get<string>('S3_REGION') ?? 'ru-1';
    const accessKeyId = config.get<string>('S3_ACCESS_KEY');
    const secretAccessKey = config.get<string>('S3_SECRET_KEY');
    const forcePathStyle = (config.get<string>('S3_FORCE_PATH_STYLE') ?? 'true') === 'true';

    if (!endpoint || !accessKeyId || !secretAccessKey) {
      throw new Error('S3 config missing (S3_ENDPOINT/S3_ACCESS_KEY/S3_SECRET_KEY)');
    }

    return new S3Client({
      region,
      endpoint,
      forcePathStyle,
      credentials: { accessKeyId, secretAccessKey },
    });
  },
};
