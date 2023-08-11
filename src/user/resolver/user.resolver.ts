import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Pagination, User, UserInput } from 'src/schema/graphql.schema';
import { User as UserEntity } from '../entity/user.entity';
import { UserService } from '../service/user.service';
import { Inject, ParseUUIDPipe } from '@nestjs/common';
import UserRoleLoader from '../loader/user.role.loader';
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

  @Permissions('view-all-users')
  @Query()
  getAllUsers(
    @Args('tenantId') id: string,
    @Args('pagination') pagination: Pagination,
  ): Promise<User[]> {
    return this.userService.getUsersByTenantId(id, pagination);
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
