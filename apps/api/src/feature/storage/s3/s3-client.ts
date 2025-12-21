import { S3Client } from '@aws-sdk/client-s3';

export function createTimewebS3Client(opts: {
  accessKeyId: string;
  secretAccessKey: string;
  endpoint: string; // например https://s3.timeweb.cloud
  region?: string;  // можно 'us-east-1' как дефолт для S3-compatible
}) {
  return new S3Client({
    region: opts.region ?? 'us-east-1',
    endpoint: opts.endpoint,
    credentials: {
      accessKeyId: opts.accessKeyId,
      secretAccessKey: opts.secretAccessKey,
    },
    forcePathStyle: true, // часто нужно для S3-compatible (если virtual-hosted не настроен)
  });
}
