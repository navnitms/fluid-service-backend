import { DataSource } from 'typeorm';
import Permission from '../entity/permission.entity';
import { PermissionNotFoundException } from 'src/auth/exception/auth.exception';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PermissionService {
  constructor(private readonly dataSource: DataSource) {}

  async getAllPermissions(): Promise<Permission[]> {
    return this.dataSource
      .getRepository(Permission)
      .find({ where: { active: true } });
  }

  async getPermissionById(id: string): Promise<Permission> {
    const permission = this.dataSource.getRepository(Permission).findOne({
      where: { active: true, id },
    });
    if (permission) {
      return permission;
    }
    throw new PermissionNotFoundException(id);
  }

  async getPermissionByName(name: string): Promise<Permission> {
    return this.dataSource.getRepository(Permission).findOneOrFail({
      where: { name },
    });
  }
}
