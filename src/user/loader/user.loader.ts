import { Inject, Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { User } from 'src/schema/graphql.schema';
import { UserService } from 'src/user/service/user.service';

@Injectable({ scope: Scope.REQUEST })
export default class UserLoader {
  UserLoader: DataLoader<string, User>;

  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
  ) {
    this.UserLoader = new DataLoader<string, User>(this.getUsersByUserIds);
  }

  getUsersByUserIds = async (userIds: readonly string[]) => {
    const users = await this.userService.getUserByUserIdsWithDeleted([
      ...userIds,
    ]);

    const userIdToUserMap: {
      [key: string]: User;
    } = {};
    users.forEach((user) => (userIdToUserMap[user.id] = user));

    const response = userIds.map((userId) => userIdToUserMap[userId]);
    return response;
  };

  public getUsersLoader(): DataLoader<string, User> {
    return this.UserLoader;
  }
}
