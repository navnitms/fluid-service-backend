import { Query, Resolver } from '@nestjs/graphql';

import { IncidentStatus } from 'src/schema/graphql.schema';

@Resolver('IncidentStatus')
export class IncidentStatusResolver {
  @Query()
  getAllIncidentStatus() {
    return Object.keys(IncidentStatus);
  }
}
