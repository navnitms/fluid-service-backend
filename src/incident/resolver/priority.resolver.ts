import { Query, Resolver } from '@nestjs/graphql';

import { Priority } from 'src/schema/graphql.schema';

@Resolver('Priority')
export class PriorityResolver {
  @Query()
  getAllPriorities() {
    return Object.keys(Priority);
  }
}
