import { IncidentOperation } from 'src/schema/graphql.schema';

export interface IncidentLogInput {
  incidentId: string;
  userId: string;
  operation: IncidentOperation;
}

export interface IncidentLogDataInput {
  assigneeId: string;
}
