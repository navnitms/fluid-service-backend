import { Injectable, Logger } from '@nestjs/common';
import { Category } from '../entity/category.entity';
import { DataSource, In } from 'typeorm';

@Injectable()
export class CategoryService {
  private logger: Logger = new Logger(CategoryService.name);
  constructor(private readonly dataSource: DataSource) {}

  async getCategoryByCategoryIdsWithDeleted(
    ids: string[],
    withDeleted = true,
  ): Promise<Category[]> {
    return this.dataSource.getRepository(Category).find({
      where: { id: In(ids) },
      withDeleted,
    });
  }

  async getAllCategories(): Promise<Category[]> {
    return this.dataSource.getRepository(Category).find({
      where: { isVisible: true },
    });
  }
}
