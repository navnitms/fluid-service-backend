import { ForbiddenException, Inject, Injectable, Logger } from '@nestjs/common';
import { DataSource, DeepPartial, EntityManager } from 'typeorm';
import { Incident } from '../entity/incident.entity';
import {
  CreateIncidentInput,
  GetIncidentFilter,
  IncidentOperation,
  IncidentStatus,
  Pagination,
} from 'src/schema/graphql.schema';
import { IncidentLog } from '../entity/incident.log.entity';
import { v4 } from 'uuid';
import { UserService } from 'src/user/service/user.service';
import { ConfigService } from '@nestjs/config';
import { buildTsQueryTerm, getTsVector } from 'src/common/utils/ts.vector.util';
import dbQuery from 'src/common/constants/db.query';
import { TenantSettingService } from 'src/tenant/service/tenant.setting.service';

@Injectable()
export class IncidentService {
  private logger: Logger = new Logger(IncidentService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
    @Inject(TenantSettingService)
    private readonly tenantSettingService: TenantSettingService,
  ) {}

  async create(
    userId: string,
    tenantId: string,
    incidentInput: CreateIncidentInput,
  ) {
    const shortId = await this.getShortIncidentId(tenantId);
    const incident: DeepPartial<Incident> = {
      id: v4(),
      tenantId,
      status: IncidentStatus.CREATED,
      createdById: userId,
      shortId,
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
        const tsQuery = await this.getIncidentVectorQuery(
          incident.title,
          incident.description,
        );
        if (tsQuery) {
          await transactionalEntityManager.query(tsQuery, [incident.id]);
        }
        return newIncident;
      },
    );
    return savedIncident;
  }

  async getIncidentByTenantId(
    tenantId?: string,
    pagination?: Pagination,
    filter?: GetIncidentFilter,
  ): Promise<Incident[]> {
    const query = this.dataSource
      .getRepository(Incident)
      .createQueryBuilder('incident');
    if (tenantId) {
      query.where('incident.tenantId = :tenantId', {
        tenantId,
      });
    }
    if (filter?.searchTerm) {
      const tsQueryTerm = buildTsQueryTerm(filter.searchTerm);
      query.addSelect(
        `ts_rank(search_term, to_tsquery('simple', :tsQueryTerm)) AS score`,
      );
      query.andWhere(
        `incident.search_term @@ to_tsquery('simple', :tsQueryTerm)`,
        {
          tsQueryTerm: tsQueryTerm,
        },
      );
      query.orderBy('score', 'DESC');
    }
    if (filter?.categoryId) {
      query.andWhere('incident.categoryId = :categoryId', {
        categoryId: filter.categoryId,
      });
    }
    if (filter?.priority) {
      query.andWhere('incident.priority = :priority', {
        priority: filter.priority,
      });
    }
    if (filter?.tenantId) {
      query.andWhere('incident.tenantId = :tenantId', {
        tenantId: filter.tenantId,
      });
    }

    if (filter?.status) {
      query.andWhere('incident.status = :status', {
        status: filter.status,
      });
    }
    if (pagination?.offset) {
      query.offset(pagination.offset);
    }
    if (pagination?.limit) {
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
      status: IncidentStatus.IN_PROGRESS,
    });
  }

  async resolveIncident(incidentId: string, userId: string, tenantId: string) {
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

  async getIncidentVectorQuery(
    title: string,
    description: string,
  ): Promise<string> {
    const tsVector =
      getTsVector(title, 'A', 'simple') +
      ' || ' +
      getTsVector(description, 'B', 'simple');
    if (tsVector) {
      const query = dbQuery.UPDATE_INCIDENT_SEARCH_TERM.replace(
        '<TSVECTOR_TERM>',
        tsVector,
      );
      return query;
    }
    return;
  }

  private async getShortIncidentId(tenantId: string): Promise<string> {
    const tenantSettings =
      await this.tenantSettingService.getTenantSettingsByTenantId(tenantId);

    const lastIncident = await this.dataSource
      .getRepository(Incident)
      .findOne({ where: { tenantId }, order: { createdAt: 'DESC' } });

    const nextNumber = lastIncident
      ? parseInt(lastIncident.shortId.split('-')[1]) + 1
      : 1;

    return `${tenantSettings.shortCode}-${nextNumber}`;
  }
}
