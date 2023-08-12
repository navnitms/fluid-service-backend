import { Inject } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { RoleService } from '../service/role.service';
import Role from '../entity/role.entity';
import { UserRoles } from 'src/schema/graphql.schema';

@Resolver('Role')
export class RoleResolver {
  constructor(
    @Inject(RoleService)
    private readonly roleService: RoleService,
  ) {}

  @Query()
  getAllRoles(): Promise<Role[]> {
    return this.roleService.getAll();
  }

  @Mutation()
  createRole(@Args('name') name: UserRoles): Promise<Role> {
    return this.roleService.createRole(name);
  }
}
