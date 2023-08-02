import { Inject } from '@nestjs/common';
import { Resolver, Query } from '@nestjs/graphql';
import { RoleService } from '../service/role.service';
import Role from '../entity/role.entity';

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
}
