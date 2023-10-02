import { Inject, Injectable, Logger } from '@nestjs/common';
import { ContractProductService } from 'src/contract/service/contract.product.service';
import { IncidentService } from 'src/incident/service/incident.service';
import {
  IncidentStatusCount,
  ProductSummary,
  TenantSummary,
} from 'src/schema/graphql.schema';
import { TenantService } from 'src/tenant/service/tenant.service';

@Injectable()
export class DashboardService {
  private logger: Logger = new Logger(DashboardService.name);

  constructor(
    @Inject(IncidentService)
    private readonly incidentService: IncidentService,
    @Inject(TenantService)
    private readonly tenantService: TenantService,
    @Inject(ContractProductService)
    private readonly contractProductService: ContractProductService,
  ) {}

  async getIncidentStatusSummary(): Promise<IncidentStatusCount> {
    return this.incidentService.getIncidentCountByStatus();
  }

  async getTenantSummary(): Promise<TenantSummary> {
    return this.tenantService.getTenantSummary();
  }

  async getProductSummary(): Promise<ProductSummary[]> {
    return this.contractProductService.getProductSummary();
  }
}
