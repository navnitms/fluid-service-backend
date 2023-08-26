import { Inject } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
  Query,
  Context,
} from '@nestjs/graphql';
import { IncidentService } from '../service/incident.service';
import {
  CreateIncidentInput,
  GetIncidentFilter,
  Incident,
  Pagination,
  PermissionType,
} from 'src/schema/graphql.schema';
import { Incident as IncidentEntity } from '../../incident/entity/incident.entity';
import UserLoader from 'src/user/loader/user.loader';
import { IncidentLogLoader } from '../loader/incident.log.loader';
import { IncidentCommentLoader } from '../loader/incident.comment.loader';
import { Permissions } from 'src/auth/decorator/permission.decorator';
import { configuration } from 'src/common/config/app.config';
import CategoryLoader from '../loader/category.loader';

@Resolver('Incident')
export class IncidentResolver {
  constructor(
    @Inject(IncidentService)
    private readonly incidentService: IncidentService,
    @Inject(UserLoader)
    private readonly userLoader: UserLoader,
    @Inject(IncidentLogLoader)
    private readonly incidentLogLoader: IncidentLogLoader,
    @Inject(IncidentCommentLoader)
    private readonly incidentCommentLoader: IncidentCommentLoader,
    @Inject(CategoryLoader)
    private readonly categoryLoader: CategoryLoader,
  ) {}

  @Permissions(PermissionType.ViewAllIncidents)
  @Mutation()
  createIncident(
    @Context('user') user: any,
    @Args('input') incidentInput: CreateIncidentInput,
  ): Promise<Incident> {
    return this.incidentService.create(user.id, user.tenantId, incidentInput);
  }

  @Permissions(PermissionType.ViewAllIncidents)
  @Query()
  getAllIncidents(
    @Context('user') user: any,
    @Args('tenantId') tenantId: string,
    @Args('pagination') pagination: Pagination,
    @Args('filter') filter: GetIncidentFilter,
  ): Promise<Incident[]> {
    const filteredtenantId =
      user.tenantId === configuration.defaultTenantId
        ? tenantId
        : user.tenantId;
    return this.incidentService.getIncidentByTenantId(
      filteredtenantId,
      pagination,
      filter,
    );
  }

  @Permissions(PermissionType.ViewAllIncidents)
  @Query()
  getIncidentById(
    @Context('user') user: any,
    @Args('tenantId') tenantId: string,
    @Args('incidentId') incidentId: string,
  ): Promise<Incident> {
    const filteredtenantId =
      user.tenantId === configuration.defaultTenantId
        ? tenantId
        : user.tenantId;
    return this.incidentService.getIncidentById(incidentId, filteredtenantId);
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

  @ResolveField()
  async comments(@Parent() incident: IncidentEntity) {
    return this.incidentCommentLoader
      .getIncidentCommentLoader()
      .load(incident.id);
  }

  @ResolveField()
  async category(@Parent() incident: IncidentEntity) {
    if (incident.categoryId) {
      return this.categoryLoader.getCategoryLoader().load(incident.categoryId);
    }
  }
}
