import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/user/entity/user.entity';
import { TokenType } from '../constants/authentication.constants';
import { v4 } from 'uuid';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthenticationHelper {
  private readonly logger = new Logger(AuthenticationHelper.name);
  constructor(private readonly configService: ConfigService) {}

  generateAccessToken(userDetails: User) {
    const expiresIn =
      this.configService.get('JWT_TOKEN_EXPTIME') * 1 || 60 * 60;
    const secret = this.configService.get('JWT_SECRET');
    const username = userDetails.email;

    const dataStoredInToken = {
      username: username,
      sub: userDetails.id,
      tenantId: userDetails.tenantId,
      env: this.configService.get('ENV') || 'local',
      tokenType: TokenType.AccessToken,
    };
    return jwt.sign(dataStoredInToken, secret, { expiresIn });
  }

  generateRefreshToken(userDetails: User) {
    const expiresIn =
      this.configService.get('JWT_REFRESH_TOKEN_EXP_TIME') * 1 || 60 * 60;
    const secret = this.configService.get('JWT_SECRET') as string;

    const dataStoredInToken = {
      sub: userDetails.id,
      tenantId: userDetails.tenantId,
      env: this.configService.get('ENV') || 'local',
      tokenType: TokenType.RefreshToken,
      refreshId: v4(),
    };
    return {
      refreshId: dataStoredInToken.refreshId,
      refreshToken: jwt.sign(dataStoredInToken, secret, { expiresIn }),
    };
  }

  generateTokenForUser(userDetails: User) {
    const accessToken = this.generateAccessToken(userDetails);
    const { refreshToken, refreshId } = this.generateRefreshToken(userDetails);
    return { accessToken, refreshToken, refreshId };
  }

  validateAuthToken(authorization: string, tokenType: TokenType) {
    const secret = this.configService.get('JWT_SECRET') || '';
    const reqAuthToken = authorization;
    const verify = () => {
      try {
        const res = jwt.verify(reqAuthToken, secret);
        return res;
      } catch (err) {
        this.logger.debug(err);
        throw new UnauthorizedException('Authentication token is invalid');
      }
    };
    const verificationResponse: any = verify();
    const env = this.configService.get('ENV') || 'local';
    if (
      verificationResponse.env !== env ||
      verificationResponse.tokenType !== tokenType
    ) {
      throw new UnauthorizedException();
    }
    const user = { ...verificationResponse, id: verificationResponse.sub };
    return user;
  }
}
