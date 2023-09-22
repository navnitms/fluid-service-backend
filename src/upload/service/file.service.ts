import { Injectable, Logger } from '@nestjs/common';
import { UploadType } from 'src/schema/graphql.schema';
import { DataSource } from 'typeorm';

@Injectable()
export class FileService {
  private logger: Logger = new Logger(FileService.name);

  constructor(private readonly dataSource: DataSource) {}

  async setFilePathAndContentType(fileName: string, uploadType: UploadType) {
    const splitName = await this.fileNameAndExt(fileName);
    const pdfPath = `${uploadType}/pdf/${splitName[0]}${Date.now()}.pdf`;
    const imagePath = `${uploadType}/jpg/${splitName[0]}${Date.now()}.jpg`;
    const jpegPath = `${uploadType}/jpg/${splitName[0]}${Date.now()}.jpeg`;

    let filePath: string;
    let contentType: string;

    switch (splitName[1]) {
      case 'pdf':
        filePath = pdfPath;
        contentType = 'application/pdf';
        break;
      case 'jpg':
        filePath = imagePath;
        contentType = 'mime/jpg';
        break;
      case 'jpeg':
        filePath = jpegPath;
        contentType = 'mime/jpg';
        break;
    }
    return { filePath, contentType, name: splitName[0] };
  }

  async fileNameAndExt(filePath: string) {
    const fileName = filePath.split('/   ').pop();
    return [
      fileName.substring(0, fileName.lastIndexOf('.')),
      fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length),
    ];
  }
}
