import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { TokenType } from '../constants/authentication.constants';
import { AuthenticationHelper } from '../service/authentication.helper';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(AuthenticationHelper)
    private readonly authenticationHelper: AuthenticationHelper,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext();
    const request = ctx.req as Request;
    const token = request.headers?.authorization;
    if (ctx) {
      const reqAuthToken = token?.split(' ')[1];
      ctx.user = this.authenticationHelper.validateAuthToken(
        reqAuthToken,
        TokenType.AccessToken,
      );
      return true;
    }
    return false;
  }
}
