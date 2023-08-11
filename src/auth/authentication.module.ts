import { Module, forwardRef } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { UserModule } from 'src/user/user.module';
import { AuthenticationHelper } from './service/authentication.helper';
import { AuthenticationService } from './service/authentication.service';
import { AuthenticationResolver } from './resolver/authentication.resolver';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from './guard/authentication.guard';

@Module({
  imports: [CommonModule, forwardRef(() => UserModule)],
  providers: [
    AuthenticationHelper,
    AuthenticationService,
    AuthenticationResolver,
    AuthGuard,
    ConfigService,
  ],
  exports: [AuthenticationHelper],
})
export class AuthenticationModule {}
