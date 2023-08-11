import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthenticationService } from '../service/authentication.service';
import { Inject } from '@nestjs/common';
import { Authentication, LoginInput } from 'src/schema/graphql.schema';

@Resolver('Authentication')
export class AuthenticationResolver {
  constructor(
    @Inject(AuthenticationService)
    private readonly authenticationService: AuthenticationService,
  ) {}

  @Mutation()
  login(@Args('input') input: LoginInput): Promise<Authentication> {
    return this.authenticationService.login(input);
  }
}
