import { Args, Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { AuthenticationService } from '../service/authentication.service';
import { Inject } from '@nestjs/common';
import { Authentication, LoginInput } from 'src/schema/graphql.schema';
import { UserService } from 'src/user/service/user.service';

@Resolver('Authentication')
export class AuthenticationResolver {
  constructor(
    @Inject(AuthenticationService)
    private readonly authenticationService: AuthenticationService,
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  @Mutation()
  login(@Args('input') input: LoginInput): Promise<Authentication> {
    return this.authenticationService.login(input);
  }

  @ResolveField()
  async permissions(@Parent() auth: Authentication) {
    return this.userService.getUserPermissions(auth.user.id);
  }
}
