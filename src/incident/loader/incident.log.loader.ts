import { Inject, Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { IncidentLog } from '../entity/incident.log.entity';
import { IncidentLogService } from '../service/incident.log.service';

@Injectable({ scope: Scope.REQUEST })
export class IncidentLogLoader {
  incidentLogLoader: DataLoader<string, IncidentLog[]>;
  constructor(
    @Inject(IncidentLogService)
    private readonly incidentLogService: IncidentLogService,
  ) {
    this.incidentLogLoader = new DataLoader<string, IncidentLog[]>(
      this.getIncidentLogsByIncidentIds,
    );
  }

  getIncidentLogsByIncidentIds = async (incidentIds: readonly string[]) => {
    const incidentLogs =
      await this.incidentLogService.getIncidentLogByIncidentId([
        ...incidentIds,
      ]);

    const incidentLogsMap: { [key: string]: IncidentLog[] } = {};

    incidentLogs.forEach((incidentLog) => {
      if (!incidentLogsMap[incidentLog.incidentId]) {
        incidentLogsMap[incidentLog.incidentId] = [];
      }
      incidentLogsMap[incidentLog.incidentId].push(incidentLog);
    });
    const response: IncidentLog[][] = incidentIds.map(
      (incidentId) => incidentLogsMap[incidentId],
    );
    return response;
  };
  public getIncidentLogLoader(): DataLoader<string, IncidentLog[]> {
    return this.incidentLogLoader;
  }
}
