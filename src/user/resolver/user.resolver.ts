import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import {
  Pagination,
  PermissionType,
  UpdateUserInput,
  User,
  UserInput,
} from 'src/schema/graphql.schema';
import { User as UserEntity } from '../entity/user.entity';
import { UserService } from '../service/user.service';
import { Inject, ParseUUIDPipe } from '@nestjs/common';
import UserRoleLoader from '../loader/user.role.loader';
import { configuration } from 'src/common/config/app.config';
import { Permissions } from 'src/auth/decorator/permission.decorator';

@Resolver('User')
export class UserResolver {
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
    @Inject(UserRoleLoader)
    private readonly userRoleLoader: UserRoleLoader,
  ) {}
  @Mutation()
  createUser(@Args('input') userInput: UserInput): Promise<User> {
    return this.userService.create(userInput.tenantId, userInput);
  }

  @Mutation()
  deleteUser(@Args('id', ParseUUIDPipe) userId: string): Promise<string> {
    return this.userService.deleteUser(userId);
  }

  @Mutation()
  updateUser(
    @Args('id', ParseUUIDPipe) userId: string,
    @Args('input') userInput: UpdateUserInput,
  ): Promise<User> {
    return this.userService.updateUserDetails(userId, userInput);
  }

  @Permissions(PermissionType.ViewAllIncidents)
  @Query()
  getAllUsers(
    @Context('user') user: any,
    @Args('tenantId') id: string,
    @Args('pagination') pagination: Pagination,
  ): Promise<User[]> {
    const filteredtenantId =
      user.tenantId === configuration.defaultTenantId ? id : user.tenantId;
    return this.userService.getUsersByTenantId(filteredtenantId, pagination);
  }

  @Query()
  getUserById(@Args('id', ParseUUIDPipe) userId: string): Promise<User> {
    return this.userService.getUserById(userId);
  }

  @ResolveField()
  async role(@Parent() user: UserEntity) {
    return this.userRoleLoader.getUserRoleLoader().load(user.id);
  }
}
