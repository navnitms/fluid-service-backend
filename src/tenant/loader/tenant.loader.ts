import { Inject, Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { Tenant } from 'src/schema/graphql.schema';
import { TenantService } from '../service/tenant.service';

@Injectable({ scope: Scope.REQUEST })
export default class TenantLoader {
  TenantLoader: DataLoader<string, Tenant>;

  constructor(
    @Inject(TenantService)
    private readonly tenantService: TenantService,
  ) {
    this.TenantLoader = new DataLoader<string, Tenant>(
      this.getTenantsByTenantIds,
    );
  }

  getTenantsByTenantIds = async (tenantIds: readonly string[]) => {
    const tenants = await this.tenantService.getTenantByTenantIdsWithDeleted([
      ...tenantIds,
    ]);

    const tenantIdToTenantMap: {
      [key: string]: Tenant;
    } = {};
    tenants.forEach((tenant) => (tenantIdToTenantMap[tenant.id] = tenant));

    const response = tenantIds.map((tenantId) => tenants[tenantId]);
    return response;
  };

  public getTenantsLoader(): DataLoader<string, Tenant> {
    return this.TenantLoader;
  }
}
