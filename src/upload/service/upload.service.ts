import {
  PutObjectCommand,
  GetObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { configuration } from '../../common/config/app.config';
import { DataSource } from 'typeorm';
import { Upload } from '../entity/upload.entity';
import { v4 } from 'uuid';
import { FileService } from './file.service';
import { Upload as UploadModel, UploadType } from 'src/schema/graphql.schema';
import { UploadStatus } from '../enum/upload.status.enum';

@Injectable()
export class UploadService {
  private logger: Logger = new Logger(UploadService.name);

  constructor(
    private readonly dataSource: DataSource,
    @Inject(FileService)
    private readonly fileService: FileService,
  ) {
    this.client = new S3Client({
      region: configuration.aws.region,
      endpoint: 'http://localhost:4566',
      forcePathStyle: true,
      credentials: {
        accessKeyId: configuration.aws.accessKey,
        secretAccessKey: configuration.aws.secret,
      },
    });
  }

  private client: S3Client;

  async generatePresignedUrlForUpload(
    tenantId: string,
    name: string,
    referenceId: string,
  ): Promise<UploadModel> {
    const repo = this.dataSource.getRepository(Upload);
    const { filePath, name: fileName } =
      await this.fileService.setFilePathAndContentType(
        name,
        UploadType.INCIDENT,
      );

    const upload = repo.create({
      id: v4(),
      tenantId: tenantId,
      name: fileName,
      key: filePath,
      referenceId,
      referenceType: UploadType.INCIDENT,
      status: UploadStatus.GENERATED,
    });
    await repo.save(upload);
    const url = await this.preSignedURLForUpload(filePath);

    return {
      id: upload.id,
      url,
    };
  }

  async preSignedURLForUpload(key: string) {
    console.log(configuration.aws);
    console.log(Date.now());
    const command = new PutObjectCommand({
      Bucket: configuration.aws.bucket,
      Key: key,
    });
    return getSignedUrl(this.client, command, { expiresIn: 3600 });
  }

  async preSignedURLForDownload(key: string) {
    const command = new GetObjectCommand({
      Bucket: configuration.aws.bucket,
      Key: key,
    });
    return getSignedUrl(this.client, command, { expiresIn: 3600 });
  }
}
