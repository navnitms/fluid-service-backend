import { Injectable, Logger } from '@nestjs/common';
import { DataSource, DeepPartial, EntityManager } from 'typeorm';
import { Incident } from '../entity/incident.entity';
import {
  CreateIncidentInput,
  IncidentOperation,
  IncidentStatus,
  Pagination,
} from 'src/schema/graphql.schema';
import { IncidentLog } from '../entity/incident.log.entity';
import { v4 } from 'uuid';

@Injectable()
export class IncidentService {
  private logger: Logger = new Logger(IncidentService.name);

  constructor(private readonly dataSource: DataSource) {}

  async create(
    userId: string,
    tenantId: string,
    incidentInput: CreateIncidentInput,
  ) {
    const incident: DeepPartial<Incident> = {
      id: v4(),
      tenantId,
      status: IncidentStatus.CREATED,
      createdById: userId,
      ...incidentInput,
    };
    const incidentLog: DeepPartial<IncidentLog> = {
      incidentId: incident.id,
      userId,
      operation: IncidentOperation.INCIDENT_CREATED,
    };

    const savedIncident = await this.dataSource.transaction(
      async (transactionalEntityManager: EntityManager) => {
        const incidentRepo = transactionalEntityManager.getRepository(Incident);
        const incidentLogRepo =
          transactionalEntityManager.getRepository(IncidentLog);
        const newIncident = await incidentRepo.create(incident);
        await incidentRepo.save(incident);
        await incidentLogRepo.save(incidentLog);
        return newIncident;
      },
    );
    return savedIncident;
  }

  async getIncidentByTenantId(
    tenantId: string,
    pagination: Pagination,
  ): Promise<Incident[]> {
    const query = this.dataSource
      .getRepository(Incident)
      .createQueryBuilder('incident')
      .where('incident.tenantId = :tenantId', {
        tenantId,
      });
    if (pagination) {
      query.offset(pagination.offset);
      query.limit(pagination.limit);
    }
    query.orderBy('incident.createdAt', 'DESC');
    return query.getMany();
  }

  async getIncidentById(id: string, tenantId?: string) {
    return this.dataSource
      .getRepository(Incident)
      .findOneOrFail({ where: { id, tenantId } });
  }
}
