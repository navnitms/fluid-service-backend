import { Inject } from '@nestjs/common';
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import UserLoader from 'src/user/loader/user.loader';
import { IncidentLog as IncidentLogEntity } from '../entity/incident.log.entity';

@Resolver('IncidentLog')
export class IncidentLogResolver {
  constructor(
    @Inject(UserLoader)
    private readonly userLoader: UserLoader,
  ) {}

  @ResolveField()
  async user(@Parent() incidentLog: IncidentLogEntity) {
    return this.userLoader.getUsersLoader().load(incidentLog.userId);
  }
}
