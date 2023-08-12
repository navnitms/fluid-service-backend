import { ForbiddenException, Inject, Injectable, Logger } from '@nestjs/common';
import { DataSource, DeepPartial, EntityManager } from 'typeorm';
import { Incident } from '../entity/incident.entity';
import {
  CreateIncidentInput,
  IncidentOperation,
  IncidentStatus,
  Pagination,
  UserRoles,
} from 'src/schema/graphql.schema';
import { IncidentLog } from '../entity/incident.log.entity';
import { v4 } from 'uuid';
import { UserService } from 'src/user/service/user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class IncidentService {
  private logger: Logger = new Logger(IncidentService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

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

  async assignIncident(incidentId: string, assigneeId: string) {
    return this.dataSource
      .getRepository(Incident)
      .update(incidentId, { assigneeId });
  }

  async acknowledgeIncident(incidentId: string, acknowldgerId: string) {
    return this.dataSource.getRepository(Incident).update(incidentId, {
      acknowledgedById: acknowldgerId,
      status: IncidentStatus.ADMIN_IN_PROGRESS,
    });
  }

  async resolverIncident(incidentId: string, tenantId: string) {
    const repo = this.dataSource.getRepository(Incident);
    const incident = await repo.findOneOrFail({ where: { id: incidentId } });
    if (
      incident.tenantId != tenantId ||
      incident.tenantId != this.configService.get('DEFAULT_TENANT')
    ) {
      throw new ForbiddenException('Unauthorized to perform this operation');
    }
    return repo.update(incidentId, { status: IncidentStatus.RESOLVED });
  }
}
