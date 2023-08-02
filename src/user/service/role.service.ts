import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import Role from '../entity/role.entity';

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
}
