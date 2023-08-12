import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import RolePermission from '../entity/role.permission.entity';
import Role from '../entity/role.entity';
import { PermissionType, UserRoles } from 'src/schema/graphql.schema';

@Injectable()
export class RolePermissionService {
  constructor(private readonly dataSource: DataSource) {}
  async getPermissionByRoleId(id: string): Promise<RolePermission[]> {
    return this.dataSource.getRepository(RolePermission).find({
      where: { roleId: id },
    });
  }

  async createRolePermissionModel(
    id: string,
    permissions: string[],
  ): Promise<RolePermission[]> {
    return this.dataSource.getRepository(RolePermission).create(
      permissions.map((permission) => ({
        roleId: id,
        permissionId: permission,
      })),
    );
  }

  async saveRolePermission(
    rolePermission: RolePermission[],
    em?: EntityManager,
  ): Promise<RolePermission[]> {
    return em
      ? em.save(RolePermission, rolePermission)
      : await this.dataSource
          .getRepository(RolePermission)
          .save(rolePermission);
  }

  async deleteRolePermission(id: string): Promise<void> {
    this.dataSource.getRepository(RolePermission).delete({ roleId: id });
  }

  async getRolePermissionFromEnum(role: Role) {
    switch (role.name) {
      case UserRoles.OWNER: {
        return [PermissionType.ViewAllIncidents];
        break;
      }
      default: {
        return [];
      }
    }
  }
}
