import { Module } from '@nestjs/common';
import { TenantsResolver } from './resolver/tenant.resolver';
import { CommonModule } from 'src/common/common.module';
import { TenantService } from './service/tenant.service';
import { TenantSettingService } from './service/tenant.setting.service';
import { AddressService } from './service/address.service';
import { AddressResolver } from './resolver/address.resolver';
import { DistrictResolver } from './resolver/district.resolver';
import { TenantNotesResolver } from './resolver/tenant.notes.resolver';
import { TenantNotesService } from './service/tenant.note.service';
import TenantLoader from './loader/tenant.loader';

@Module({
  imports: [CommonModule],
  providers: [
    TenantsResolver,
    TenantService,
    TenantSettingService,
    AddressService,
    AddressResolver,
    DistrictResolver,
    TenantNotesResolver,
    TenantNotesService,
    TenantLoader,
  ],
  exports: [TenantLoader],
})
export class TenantModule {}
