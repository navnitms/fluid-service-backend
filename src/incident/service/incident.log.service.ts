import { Inject, Injectable, Logger } from '@nestjs/common';
import { DataSource, DeepPartial, EntityManager, In } from 'typeorm';
import { IncidentLog } from '../entity/incident.log.entity';
import {
  IncidentLogDataInput,
  IncidentLogInput,
} from '../models/incident.log.input';
import { v4 } from 'uuid';
import { IncidentOperation } from 'src/schema/graphql.schema';
import { UserService } from 'src/user/service/user.service';

@Injectable()
export class IncidentLogService {
  private logger: Logger = new Logger(IncidentLogService.name);

  constructor(
    private readonly dataSource: DataSource,
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  async getIncidentLogByIncidentId(ids: string[]): Promise<IncidentLog[]> {
    return this.dataSource.getRepository(IncidentLog).find({
      where: { incidentId: In(ids) },
    });
  }

  async createIncidentLog(
    incidentLogInput: IncidentLogInput,
    em?: EntityManager,
  ) {
    const repo = em
      ? em.getRepository(IncidentLog)
      : this.dataSource.getRepository(IncidentLog);
    const text = await this.generatetextForIncidentLog(
      incidentLogInput.userId,
      incidentLogInput.operation,
    );
    const incidentLog: DeepPartial<IncidentLog> = {
      id: v4(),
      userId: incidentLogInput.userId,
      incidentId: incidentLogInput.incidentId,
      operation: incidentLogInput.operation,
      text,
    };

    return repo.save(incidentLog);
  }

  async generatetextForIncidentLog(
    userId: string,
    operation: IncidentOperation,
    data?: IncidentLogDataInput,
  ) {
    let text: string;
    const user = await this.userService.getUserById(userId);
    switch (operation) {
      case IncidentOperation.INCIDENT_CREATED: {
        text = `Incident Created By ${user.name}`;
        break;
      }
      case IncidentOperation.INCIDENT_RESOLVED: {
        text = `Incident Resolved By ${user.name}`;
        break;
      }
      case IncidentOperation.INCIDENT_ACKNOWLEDGED: {
        text = `Incident Acknowledged By ${user.name}`;
        break;
      }
      case IncidentOperation.INCIDENT_ASSIGNED: {
        if (data.assigneeId !== userId) {
          const assignee = await this.userService.getUserById(data.assigneeId);
          text = `Incident Assigned To ${assignee.name} By ${user.name}`;
        } else {
          text = `Incident Self Assigned By ${user.name}`;
        }
        break;
      }
      default: {
        text = `Invalid OperationType`;
        break;
      }
    }
    return text;
  }
}
