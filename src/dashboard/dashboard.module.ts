import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { IncidentModule } from 'src/incident/incident.module';
import { TenantModule } from 'src/tenant/tenant.module';
import { DashboardResolver } from './resolver/dashboard.resolver';
import { DashboardService } from './service/dashboard.service';
import { ContractModule } from 'src/contract/contract.module';

@Module({
  imports: [CommonModule, TenantModule, IncidentModule, ContractModule],
  providers: [DashboardResolver, DashboardService],
  exports: [],
})
export class DashboardModule {}
