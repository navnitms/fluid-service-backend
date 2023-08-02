import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TenantCategory } from '../entity/tenant.category.entity';

@Injectable()
export class TenantCategoryService {
  private logger: Logger = new Logger(TenantCategoryService.name);

  constructor(private readonly dataSource: DataSource) {}

  async getAllTenantCategories(): Promise<any[]> {
    return this.dataSource
      .getRepository(TenantCategory)
      .createQueryBuilder()
      .getMany();
  }
}
