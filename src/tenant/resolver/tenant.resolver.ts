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
  TenantSummary,
  UpdateTenantInput,
} from 'src/schema/graphql.schema';
import { TenantService } from '../service/tenant.service';
import { Inject, ParseUUIDPipe } from '@nestjs/common';
import { TenantSettingService } from '../service/tenant.setting.service';
import { AddressService } from '../service/address.service';
import { TenantNotesService } from '../service/tenant.note.service';
import TenantCategoryLoader from '../loader/tenant.category.loader';
import { Tenant as TenantEntity } from '../entity/tenant.entity';

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
    @Inject(TenantCategoryLoader)
    private readonly tenantCategoryLoader: TenantCategoryLoader,
  ) {}

  @Mutation()
  createTenant(@Args('input') tenantInput: TenantInput): Promise<Tenant> {
    return this.tenantsService.create(tenantInput);
  }

  @Mutation()
  updateTenant(
    @Args('tenantId') tenantId: string,
    @Args('input') tenantInput: UpdateTenantInput,
  ): Promise<Tenant> {
    return this.tenantsService.updateTenantDetails(tenantId, tenantInput);
  }

  @Query()
  getTenantDetails(@Args('id', ParseUUIDPipe) id: string): Promise<Tenant> {
    return this.tenantsService.getTenantById(id);
  }

  @Query()
  getTenantSummary(): Promise<TenantSummary> {
    return this.tenantsService.getTenantSummary();
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

  @ResolveField()
  async category(@Parent() tenant: TenantEntity) {
    const category = await this.tenantCategoryLoader
      .getTenantCategorysLoader()
      .load(tenant.categoryId);
    return category;
  }
}
