import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { IncidentResolver } from './resolver/incident.resolver';
import { IncidentService } from './service/incident.service';
import { UserModule } from 'src/user/user.module';
import { TenantModule } from 'src/tenant/tenant.module';
import { IncidentLogService } from './service/incident.log.service';
import { IncidentLogLoader } from './loader/incident.log.loader';
import { IncidentLogResolver } from './resolver/incident.log.resolver';

@Module({
  imports: [CommonModule, UserModule, TenantModule],
  providers: [
    IncidentResolver,
    IncidentService,
    IncidentLogLoader,
    IncidentLogService,
    IncidentLogResolver,
  ],
  exports: [],
})
export class IncidentModule {}
