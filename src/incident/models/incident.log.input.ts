import { IncidentOperation } from 'src/schema/graphql.schema';

export interface IncidentLogInput {
  incidetId: string;
  userId: string;
  operation: IncidentOperation;
}
