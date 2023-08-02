import { Inject, Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import Role from '../entity/role.entity';
import { UserService } from '../service/user.service';

@Injectable({ scope: Scope.REQUEST })
export default class UserRoleLoader {
  userRoleLoader: DataLoader<string, Role>;
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
  ) {
    this.userRoleLoader = new DataLoader<string, Role>(this.getRoleByUserId);
  }

  getRoleByUserId = async (userIds: readonly string[]) => {
    const usersRoles = await this.userService
      .getUserIds([...userIds], ['role'])
      .then((users) =>
        users.map((e) => {
          return { userId: e.id, role: e.role };
        }),
      );

    const userRoleMap: { [key: string]: Role } = {};

    usersRoles.map((userRole: UserRole) => {
      if (userRole.role) {
        const tm: Role = {
          ...userRole.role,
        } as Role;
        userRoleMap[userRole.userId] = tm;
      }
    });

    const response = userIds.map((userId) => userRoleMap[userId]);

    return response;
  };

  public getUserRoleLoader(): DataLoader<string, Role> {
    return this.userRoleLoader;
  }
}
export class UserRole {
  public userId!: string;
  public role?: Role;
}
