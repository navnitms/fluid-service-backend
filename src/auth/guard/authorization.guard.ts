import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { OperationType } from '../../schema/graphql.schema';
import { UserService } from 'src/user/service/user.service';
import { setTenantId } from 'src/tenant/util/tenant.util';

@Injectable()
export class AuthorizationGaurd implements CanActivate {
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
    private readonly reflector: Reflector,
  ) {}
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext();
    const permissionsRequired = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );
    const operationType = this.reflector.get<OperationType>(
      'operationType',
      context.getHandler(),
    );
    const userId = ctx.user.id;
    const { verified, userPermissions } =
      await this.userService.verifyAndFetchUserPermissions(
        userId,
        permissionsRequired,
        operationType,
      );
    setTenantId(ctx.user.tenantId);
    if (verified && ctx.user) {
      ctx.user.permissions = userPermissions;
    }
    return verified;
  }
}
