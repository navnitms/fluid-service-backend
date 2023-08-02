import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { UserResolver } from './resolver/user.resolver';
import { UserService } from './service/user.service';
import { RoleService } from './service/role.service';
import UserRoleLoader from './loader/user.role.loader';
import UserLoader from './loader/user.loader';

@Module({
  imports: [CommonModule],
  providers: [
    UserResolver,
    UserService,
    RoleService,
    UserRoleLoader,
    UserLoader,
  ],
  exports: [UserLoader],
})
export class UserModule {}
