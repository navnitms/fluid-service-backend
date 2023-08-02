import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import {
  Pagination,
  Tenant,
  TenantFilter,
  TenantInput,
} from 'src/schema/graphql.schema';
import { TenantService } from '../service/tenant.service';
import { Inject, ParseUUIDPipe } from '@nestjs/common';
import { TenantSettingService } from '../service/tenant.setting.service';
import { AddressService } from '../service/address.service';
import { TenantNotesService } from '../service/tenant.note.service';

@Resolver('Tenant')
export class TenantsResolver {
  constructor(
    @Inject(TenantService)
    private readonly tenantsService: TenantService,
    @Inject(TenantSettingService)
    private readonly tenantSettingService: TenantSettingService,
    @Inject(AddressService)
    private readonly addressService: AddressService,
    @Inject(TenantNotesService)
    private readonly tenantNotesService: TenantNotesService,
  ) {}

  @Mutation()
  createTenant(@Args('input') tenantInput: TenantInput): Promise<Tenant> {
    return this.tenantsService.create(tenantInput);
  }

  @Query()
  getTenantDetails(@Args('id', ParseUUIDPipe) id: string): Promise<Tenant> {
    return this.tenantsService.getTenantById(id);
  }

  @Query()
  getAllTenants(
    @Args('input') tenantFilter?: TenantFilter,
    @Args('pagination') pagination?: Pagination,
  ): Promise<Tenant[]> {
    return this.tenantsService.getAllTenants(tenantFilter, pagination);
  }

  @ResolveField()
  async settings(@Parent() tenant: Tenant) {
    const settings =
      await this.tenantSettingService.getTenantSettingsByTenantId(tenant.id);
    return settings;
  }

  @ResolveField()
  async address(@Parent() tenant: Tenant) {
    const settings = await this.addressService.getAddressesBytenantId(
      tenant.id,
    );
    return settings;
  }

  @ResolveField()
  async notes(@Parent() tenant: Tenant) {
    const settings = await this.tenantNotesService.getAllTenantNotes(tenant.id);
    return settings;
  }
}
