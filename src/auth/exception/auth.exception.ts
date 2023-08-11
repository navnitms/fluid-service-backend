import { NotFoundException, PreconditionFailedException } from '@nestjs/common';

export class PermissionNotFoundException extends NotFoundException {
  constructor(permissionId: string) {
    super(`Permission ${permissionId} not found`);
  }
}

export class PermissionDeleteNotAllowedException extends PreconditionFailedException {
  constructor(permissionId: string) {
    super(`Permission ${permissionId} cannot be deleted`);
  }
}

export class UserNotAuthorizedException extends PreconditionFailedException {
  constructor(action: string) {
    super(`User not authorized to perform the action ${action}`);
  }
}
