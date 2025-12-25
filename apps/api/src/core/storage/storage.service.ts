import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3_CLIENT } from './s3/s3.constants';

@Injectable()
export class StorageService {
  private readonly bucket: string;

  constructor(
    @Inject(S3_CLIENT) private readonly s3: S3Client,
    private readonly config: ConfigService,
  ) {
    const bucket = this.config.get<string>('S3_BUCKET');
    if (!bucket) throw new Error('S3_BUCKET is missing');
    this.bucket = bucket;
  }

  private buildKey(projectId: string, path: string): string {
    const safe = path.replace(/^\/+/, '');
    return `projects/${projectId}/${safe}`;
  }

  async presignUpload(params: {
    projectId: string;
    path: string;
    contentType: string;
    expiresInSec?: number;
  }) {
    const Key = this.buildKey(params.projectId, params.path);
    const cmd = new PutObjectCommand({
      Bucket: this.bucket,
      Key,
      ContentType: params.contentType,
    });

    const url = await getSignedUrl(this.s3, cmd, { expiresIn: params.expiresInSec ?? 300 });
    return { bucket: this.bucket, key: Key, url };
  }

  async presignDownload(params: { projectId: string; path: string; expiresInSec?: number }) {
    const Key = this.buildKey(params.projectId, params.path);
    const cmd = new GetObjectCommand({ Bucket: this.bucket, Key });

    const url = await getSignedUrl(this.s3, cmd, { expiresIn: params.expiresInSec ?? 300 });
    return { bucket: this.bucket, key: Key, url };
  }
}
