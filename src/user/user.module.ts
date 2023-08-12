import { Module, forwardRef } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { UserResolver } from './resolver/user.resolver';
import { UserService } from './service/user.service';
import { RoleService } from './service/role.service';
import UserRoleLoader from './loader/user.role.loader';
import UserLoader from './loader/user.loader';
import { AuthenticationModule } from 'src/auth/authentication.module';
import { PermissionService } from './service/permission.service';
import { RolePermissionService } from './service/role.permission.service';
import { RoleResolver } from './resolver/role.resolver';

@Module({
  imports: [CommonModule, forwardRef(() => AuthenticationModule)],
  providers: [
    UserResolver,
    UserService,
    RoleService,
    RoleResolver,
    UserRoleLoader,
    UserLoader,
    PermissionService,
    RolePermissionService,
  ],
  exports: [UserLoader, UserService],
})
export class UserModule {}
