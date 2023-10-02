import { Query, Resolver } from '@nestjs/graphql';
import { DashboardService } from '../service/dashboard.service';
import { Inject } from '@nestjs/common';
import {
  IncidentStatusCount,
  ProductSummary,
  TenantSummary,
} from 'src/schema/graphql.schema';

@Resolver('Dashboard')
export class DashboardResolver {
  constructor(
    @Inject(DashboardService)
    private readonly dashboardService: DashboardService,
  ) {}

  @Query()
  getIncidentStatuses(): Promise<IncidentStatusCount> {
    return this.dashboardService.getIncidentStatusSummary();
  }

  @Query()
  getTenantSummary(): Promise<TenantSummary> {
    return this.dashboardService.getTenantSummary();
  }

  @Query()
  getProductSummary(): Promise<ProductSummary[]> {
    return this.dashboardService.getProductSummary();
  }
}
