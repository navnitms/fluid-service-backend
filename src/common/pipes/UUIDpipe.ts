import { ParseUUIDPipe, ArgumentMetadata } from '@nestjs/common';

export class UUIDPipe extends ParseUUIDPipe {
  async transform(value: string, metadata: ArgumentMetadata): Promise<string> {
    if (value === null || value === undefined) {
      return value;
    }
    return super.transform(value, metadata);
  }
}
