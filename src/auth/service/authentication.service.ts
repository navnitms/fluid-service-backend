import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserService } from 'src/user/service/user.service';
import { DataSource } from 'typeorm';
import { AuthenticationHelper } from './authentication.helper';
import { LoginInput } from 'src/schema/graphql.schema';

@Injectable()
export class AuthenticationService {
  private logger: Logger = new Logger(AuthenticationService.name);
  constructor(
    private readonly dataSource: DataSource,
    @Inject(UserService)
    private readonly userService: UserService,
    @Inject(AuthenticationHelper)
    private readonly authenticationHelper: AuthenticationHelper,
  ) {}

  async login(input: LoginInput) {
    const user = await this.userService.loginUser(input.email, input.password);
    const token = this.authenticationHelper.generateTokenForUser(user);
    return { user, token };
  }
}
