import { Inject } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { IncidentService } from '../service/incident.service';
import { CreateIncidentInput, Incident } from 'src/schema/graphql.schema';
import { Incident as IncidentEntity } from '../../incident/entity/incident.entity';
import UserLoader from 'src/user/loader/user.loader';
import { IncidentLogLoader } from '../loader/incident.log.loader';

@Resolver('Incident')
export class IncidentResolver {
  constructor(
    @Inject(IncidentService)
    private readonly incidentService: IncidentService,
    @Inject(UserLoader)
    private readonly userLoader: UserLoader,
    @Inject(IncidentLogLoader)
    private readonly incidentLogLoader: IncidentLogLoader,
  ) {}

  @Mutation()
  createIncident(
    @Args('input') incidentInput: CreateIncidentInput,
  ): Promise<Incident> {
    return this.incidentService.create(
      '992a74e5-a01d-4a5a-8ba7-007bd12ebb04',
      '2fc6cb8f-0a91-4d51-864a-aac61b2bd25b',
      incidentInput,
    );
  }

  @ResolveField()
  async createdBy(@Parent() incident: IncidentEntity) {
    if (incident.createdById) {
      return this.userLoader.getUsersLoader().load(incident.createdById);
    }
  }
  @ResolveField()
  async assignee(@Parent() incident: IncidentEntity) {
    if (incident.assigneeId) {
      return this.userLoader.getUsersLoader().load(incident.assigneeId);
    }
  }
  @ResolveField()
  async acknowlegedBy(@Parent() incident: IncidentEntity) {
    if (incident.acknowledgedById) {
      return this.userLoader.getUsersLoader().load(incident.acknowledgedById);
    }
  }
  @ResolveField()
  async logs(@Parent() incident: IncidentEntity) {
    return this.incidentLogLoader.getIncidentLogLoader().load(incident.id);
  }
}