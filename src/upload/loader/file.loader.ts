import { Inject, Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { UploadService } from '../service/upload.service';
import { Upload } from '../entity/upload.entity';

@Injectable({ scope: Scope.REQUEST })
export class FileLoader {
  fileLoader: DataLoader<string, Upload[]>;
  constructor(
    @Inject(UploadService)
    private readonly uploadService: UploadService,
  ) {
    this.fileLoader = new DataLoader<string, Upload[]>(
      this.getFilesByReferenceIds,
    );
  }

  getFilesByReferenceIds = async (referenceIds: readonly string[]) => {
    const uploads = await this.uploadService.getUploadByReferenceId([
      ...referenceIds,
    ]);

    const uploadMap: { [key: string]: Upload[] } = {};

    uploads.forEach((upload) => {
      if (!uploadMap[upload.referenceId]) {
        uploadMap[upload.referenceId] = [];
      }
      uploadMap[upload.referenceId].push(upload);
    });
    const response: Upload[][] = referenceIds.map(
      (referenceId) => uploadMap[referenceId],
    );
    return response;
  };
  public getFileLoader(): DataLoader<string, Upload[]> {
    return this.fileLoader;
  }
}
