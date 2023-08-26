import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { TenantSettings } from '../entity/tenant.settings.entity';
import { UpdateTenantSettingsInput } from 'src/schema/graphql.schema';

@Injectable()
export class TenantSettingService {
  constructor(private readonly dataSource: DataSource) {}

  async getTenantSettingsByTenantId(id: string): Promise<TenantSettings> {
    return this.dataSource
      .getRepository(TenantSettings)
      .findOne({ where: { tenantId: id } });
  }

  async updateTenantSettings(
    tenantId: string,
    input: UpdateTenantSettingsInput,
    entityManager?: EntityManager,
  ): Promise<TenantSettings> {
    const tenantSettingsRepo = entityManager
      ? entityManager.getRepository(TenantSettings)
      : this.dataSource.getRepository(TenantSettings);

    const settings = await tenantSettingsRepo.findOne({ where: { tenantId } });
    const address = tenantSettingsRepo.create({
      id: settings.id,
      replyToEmail: input.replyToEmail,
      phone: input.phone,
      autoEscalation: input.autoEscalation,
    });
    return tenantSettingsRepo.save(address);
  }
}
