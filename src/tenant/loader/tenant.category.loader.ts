import { Inject, Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { TenantCategory } from 'src/schema/graphql.schema';
import { TenantCategoryService } from '../service/tenant.category.service';

@Injectable({ scope: Scope.REQUEST })
export default class TenantCategoryLoader {
  TenantCategoryLoader: DataLoader<string, TenantCategory>;

  constructor(
    @Inject(TenantCategoryService)
    private readonly tenantcategoryService: TenantCategoryService,
  ) {
    this.TenantCategoryLoader = new DataLoader<string, TenantCategory>(
      this.getTenantCategorysByTenantCategoryIds,
    );
  }

  getTenantCategorysByTenantCategoryIds = async (
    tenantCategoryIds: readonly string[],
  ) => {
    const tenantCategorys =
      await this.tenantcategoryService.getTenantcategoryByIds([
        ...tenantCategoryIds,
      ]);

    const tenantCategoryIdToTenantCategoryMap: {
      [key: string]: TenantCategory;
    } = {};
    tenantCategorys.forEach(
      (tenantCategory) =>
        (tenantCategoryIdToTenantCategoryMap[tenantCategory.id] =
          tenantCategory),
    );

    const response = tenantCategoryIds.map(
      (tenantCategoryId) =>
        tenantCategoryIdToTenantCategoryMap[tenantCategoryId],
    );
    return response;
  };

  public getTenantCategorysLoader(): DataLoader<string, TenantCategory> {
    return this.TenantCategoryLoader;
  }
}
