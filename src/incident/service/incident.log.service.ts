import { Injectable, Logger } from '@nestjs/common';
import { DataSource, In } from 'typeorm';
import { IncidentLog } from '../entity/incident.log.entity';

@Injectable()
export class IncidentLogService {
  private logger: Logger = new Logger(IncidentLogService.name);

  constructor(private readonly dataSource: DataSource) {}

  async getIncidentLogByIncidentId(ids: string[]): Promise<IncidentLog[]> {
    return this.dataSource.getRepository(IncidentLog).find({
      where: { incidentId: In(ids) },
    });
  }
}
