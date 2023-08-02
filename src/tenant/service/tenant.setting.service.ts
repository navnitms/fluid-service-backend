import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TenantSettings } from '../entity/tenant.settings.entity';

@Injectable()
export class TenantSettingService {
  constructor(private readonly dataSource: DataSource) {}

  async getTenantSettingsByTenantId(id: string): Promise<TenantSettings> {
    return this.dataSource
      .getRepository(TenantSettings)
      .findOne({ where: { tenantId: id } });
  }
}
