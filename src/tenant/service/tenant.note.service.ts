import { Injectable, Logger } from '@nestjs/common';
import { DataSource, DeepPartial } from 'typeorm';
import { v4 } from 'uuid';
import { TenantNotes } from '../entity/tenant.notes.entity';
import { TenantNotesInput } from 'src/schema/graphql.schema';

@Injectable()
export class TenantNotesService {
  private logger: Logger = new Logger(TenantNotesService.name);

  constructor(private readonly dataSource: DataSource) {}

  async createTenantNotes(
    tenantNotesInput: TenantNotesInput,
  ): Promise<TenantNotes> {
    const tenantNotesRepository = this.dataSource.getRepository(TenantNotes);
    const tenantNotes: DeepPartial<TenantNotes> = {
      id: v4(),
      tenantId: tenantNotesInput.tenantId,
      remark: tenantNotesInput.remark,
    };
    return tenantNotesRepository.save(tenantNotes);
  }

  deleteTenantNotes(tenantNotesId: string) {
    return this.dataSource.getRepository(TenantNotes).softDelete(tenantNotesId);
  }

  getAllTenantNotes(tenantId: string) {
    return this.dataSource
      .getRepository(TenantNotes)
      .createQueryBuilder('tenantNotes')
      .where('tenantNotes.tenantId = :tenantId', { tenantId })
      .orderBy('tenantNotes.createdAt', 'DESC')
      .getMany();
  }
}
