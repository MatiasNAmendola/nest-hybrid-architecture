import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Profile } from 'passport';
import { JwtPayload } from './jwt-auth.types';
import { LOCAL_PROVIDER, UNKNOWN, UserAvailable, UsersService } from '../user';
import { EmailsService } from '../../notifications';
import { convertToHttpException } from '../../../errors';

@Injectable()
export class JwtAuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly emailsService: EmailsService,
    private readonly jwtService: JwtService,
  ) {}

  public async findOrCreate(lang: string, profile: Profile): Promise<UserAvailable> {
    const { user, code } = await this.usersService.findOrCreate(lang, profile);

    if (user.email !== UNKNOWN && code !== null) {
      await this.emailsService.sendConfirmationEmail(lang, user, code);
    }

    return user;
  }

  public async validatePayload(lang: string, payload: JwtPayload): Promise<UserAvailable> {
    try {
      return await this.usersService.findWithPayload(lang, payload);
    } catch (e) {
      throw convertToHttpException(e);
    }
  }

  public generateUserFromPayload(obj: JwtPayload): UserAvailable {
    const { username, displayName: fullName, emails, provider, providerId } = obj;
    const email = emails.length > 0 ? emails[0].value : '-';

    return {
      id: obj.sub,
      username,
      fullName,
      email,
      provider,
      providerId,
      isActive: true,
      isVerified: true,
    };
  }

  public generatePayloadFromProfile(profile: Profile): JwtPayload {
    return {
      sub: profile.id,
      username: profile.username,
      displayName: profile.displayName,
      provider: profile.provider,
      providerId: profile.id,
      emails: profile.emails,
    };
  }

  public generatePayloadFromUser(user: UserAvailable): JwtPayload {
    return {
      sub: user.id,
      username: user.username,
      displayName: user.fullName,
      provider: LOCAL_PROVIDER,
      emails: [{ value: user.email }],
    };
  }

  public generateJwt(payload: JwtPayload): { accessToken: string } {
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
