import { Inject, Injectable } from '@nestjs/common';
import {
  Pagination,
  TenantFilter,
  TenantInput,
  TenantSummary,
  UpdateTenantInput,
} from 'src/schema/graphql.schema';
import { Tenant } from '../entity/tenant.entity';
import { v4 } from 'uuid';
import {
  DataSource,
  DeepPartial,
  EntityManager,
  FindOptionsRelations,
  FindOptionsWhere,
  In,
} from 'typeorm';
import { TenantSettings } from '../entity/tenant.settings.entity';
import { AddressService } from './address.service';
import { TenantStatus } from '../enum/tenant.status.enum';
import { TenantSettingService } from './tenant.setting.service';

@Injectable()
export class TenantService {
  constructor(
    private readonly dataSource: DataSource,
    @Inject(AddressService)
    private readonly addressService: AddressService,
    @Inject(TenantSettingService)
    private readonly tenantSettingService: TenantSettingService,
  ) {}

  async create(tenantInput: TenantInput): Promise<Tenant> {
    const { name, replyToEmail, categoryId, phone } = tenantInput;
    const tenant: DeepPartial<Tenant> = {
      id: v4(),
      name,
      categoryId,
    };
    const tenantSettings: DeepPartial<TenantSettings> = {
      id: v4(),
      phone,
      tenantId: tenant.id,
      replyToEmail,
    };

    const savedTenant = await this.dataSource.transaction(
      async (transactionalEntityManager: EntityManager) => {
        const tenantRepo = transactionalEntityManager.getRepository(Tenant);
        const tenantSettingsRepo =
          transactionalEntityManager.getRepository(TenantSettings);

        const address = await this.addressService.createAddress(
          tenant.id,
          {
            value: tenantInput.address.value,
            pincode: tenantInput.address.pincode,
            districtId: tenantInput.address.districtId,
          },
          transactionalEntityManager,
        );

        const tenantWithAddress = { address, ...tenant };

        // Save the tenantSettings object and get the saved entity with an assigned ID
        const savedTenantSettings = await tenantSettingsRepo.save(
          tenantSettings,
        );

        // Associate the tenant with the saved tenantSettings
        const tenantWithSettings = {
          ...tenantWithAddress,
          tenantSetting: savedTenantSettings,
        };

        // Save the tenant with associated tenantSettings
        const newTenant = tenantRepo.create(tenantWithSettings);
        await tenantRepo.save(newTenant);

        return newTenant;
      },
    );

    return savedTenant;
  }

  async updateTenantDetails(id: string, input: UpdateTenantInput) {
    const tenant = await this.getTenantById(id);

    const updatedTenant = await this.dataSource.transaction(
      async (transactionalEntityManager: EntityManager) => {
        const tenantRepo = transactionalEntityManager.getRepository(Tenant);
        const tenantDetails = tenantRepo.create({
          id: tenant.id,
          name: input.name,
          categoryId: input.categoryId,
          status: TenantStatus[input.status],
        });
        if (input.address) {
          await this.addressService.updateAddress(
            tenant.addressId,
            input.address,
            transactionalEntityManager,
          );
        }
        if (input.replyToEmail || input.phone) {
          this.tenantSettingService.updateTenantSettings(
            tenant.id,
            { replyToEmail: input.replyToEmail, phone: input.phone },
            transactionalEntityManager,
          );
        }
        return tenantRepo.save(tenantDetails);
      },
    );
    return updatedTenant;
  }

  async getTenantByTenantIdsWithDeleted(ids: string[]): Promise<Tenant[]> {
    return this.dataSource.getRepository(Tenant).find({
      where: { id: In(ids) },
      withDeleted: true,
    });
  }

  async getTenantByCriteria(
    criteria: FindOptionsWhere<Tenant>,
    relations?: FindOptionsRelations<Tenant>,
  ): Promise<Tenant> {
    return this.dataSource
      .getRepository(Tenant)
      .findOne({ where: criteria, relations });
  }

  async getTenantsByCriteria(
    criteria: FindOptionsWhere<Tenant>,
  ): Promise<Tenant[]> {
    return this.dataSource.getRepository(Tenant).find({ where: criteria });
  }

  async getAllTenants(
    tenantFilter?: TenantFilter,
    pagination?: Pagination,
  ): Promise<Tenant[]> {
    const query = this.dataSource
      .getRepository(Tenant)
      .createQueryBuilder('Tenant');
    if (tenantFilter && tenantFilter.searchTerm) {
      query.andWhere('Tenant.name ILIKE :searchTerm', {
        searchTerm: `${tenantFilter.searchTerm}%`,
      });
    }

    if (tenantFilter && tenantFilter.categoryId) {
      query.andWhere('Tenant.categoryId = :categoryId', {
        categoryId: tenantFilter.categoryId,
      });
    }
    if (pagination && pagination.offset) {
      query.offset(pagination.offset);
    }

    if (pagination && pagination.limit) {
      query.limit(pagination.limit);
    }

    return query.getMany();
  }

  async getTenantById(id: string): Promise<Tenant> {
    return this.getTenantByCriteria({ id });
  }

  async getTenantSummary(): Promise<TenantSummary> {
    const result = await this.dataSource
      .getRepository(Tenant)
      .createQueryBuilder('Tenant')
      .select('COUNT(Tenant.id)', 'total_count')
      .addSelect(
        'SUM(CASE WHEN Tenant.status = :activeStatus THEN 1 ELSE 0 END)',
        'ACTIVE',
      )
      .addSelect(
        'SUM(CASE WHEN Tenant.status = :inactiveStatus THEN 1 ELSE 0 END)',
        'INACTIVE',
      )
      .setParameter('activeStatus', TenantStatus.ACTIVE)
      .setParameter('inactiveStatus', TenantStatus.INACTIVE)
      .getRawOne();

    return {
      TOTAL_COUNT: parseInt(result.total_count),
      ACTIVE: parseInt(result.ACTIVE),
      INACTIVE: parseInt(result.INACTIVE),
    };
  }
}
