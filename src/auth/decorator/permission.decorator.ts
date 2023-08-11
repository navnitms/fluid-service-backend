import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guard/authentication.guard';
import { OperationType } from 'src/schema/graphql.schema';
import { AuthorizationGaurd } from '../guard/authorization.guard';

export const Permissions = (...permissions: string[]) => {
  return applyDecorators(
    UseGuards(AuthGuard, AuthorizationGaurd),
    SetMetadata('permissions', permissions),
    SetMetadata('operationType', OperationType.AND),
  );
};

export const ORPermissions = (...permissions: string[]) => {
  return applyDecorators(
    UseGuards(AuthGuard),
    SetMetadata('permissions', permissions),
    SetMetadata('operationType', OperationType.OR),
  );
};
