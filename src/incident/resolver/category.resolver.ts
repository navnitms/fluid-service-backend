import { Query, Resolver } from '@nestjs/graphql';
import { CategoryService } from '../service/category.service';
import { Inject } from '@nestjs/common';
import { Category } from '../entity/category.entity';

@Resolver('Category')
export class CategoryResolver {
  constructor(
    @Inject(CategoryService)
    private readonly categoryService: CategoryService,
  ) {}

  @Query()
  getAllCategories(): Promise<Category[]> {
    return this.categoryService.getAllCategories();
  }
}
