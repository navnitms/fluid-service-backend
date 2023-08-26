import { Inject, Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { Category } from 'src/schema/graphql.schema';
import { CategoryService } from '../service/category.service';

@Injectable({ scope: Scope.REQUEST })
export default class CategoryLoader {
  CategoryLoader: DataLoader<string, Category>;

  constructor(
    @Inject(CategoryService)
    private readonly categoryService: CategoryService,
  ) {
    this.CategoryLoader = new DataLoader<string, Category>(
      this.getCategorysByCategoryIds,
    );
  }

  getCategorysByCategoryIds = async (categoryIds: readonly string[]) => {
    const categorys =
      await this.categoryService.getCategoryByCategoryIdsWithDeleted([
        ...categoryIds,
      ]);

    const categoryIdToCategoryMap: {
      [key: string]: Category;
    } = {};
    categorys.forEach(
      (category) => (categoryIdToCategoryMap[category.id] = category),
    );

    const response = categoryIds.map(
      (categoryId) => categoryIdToCategoryMap[categoryId],
    );
    return response;
  };

  public getCategoryLoader(): DataLoader<string, Category> {
    return this.CategoryLoader;
  }
}
