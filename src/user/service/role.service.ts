import { Injectable } from '@nestjs/common';
import { DataSource, DeepPartial } from 'typeorm';
import Role from '../entity/role.entity';
import { UserRoles } from 'src/schema/graphql.schema';
import { v4 } from 'uuid';

@Injectable()
export class RoleService {
  constructor(private readonly dataSource: DataSource) {}

  async getAll(): Promise<Role[]> {
    return this.dataSource.getRepository(Role).find({
      where: {
        active: true,
      },
    });
  }

  async getById(id: string): Promise<Role> {
    return this.dataSource.getRepository(Role).findOneOrFail({
      where: {
        id,
      },
    });
  }

  async getByName(name: string): Promise<Role> {
    return this.dataSource.getRepository(Role).findOneOrFail({
      where: {
        name,
      },
    });
  }

  async createRole(roleName: UserRoles) {
    const role: DeepPartial<Role> = {
      id: v4(),
      name: roleName,
      active: true,
    };
    return this.dataSource.getRepository(Role).save(role);
  }
}
