import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { getI18nContextFromRequest } from 'nestjs-i18n';
import { convertToHttpException } from '../../../../errors';
import { UserAvailable } from '../../user';
import { Strategy } from 'passport-twitch-latest';
import merge from 'lodash.merge';
import { JwtAuthService } from '../../jwt-auth';
import { TwitchAuthModuleOptions, TwitchAuthResult } from './twitch.types';
import { TWITCH_HYBRID_AUTH_OPTIONS } from './twitch.constants';

@Injectable()
export class TwitchAuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(TWITCH_HYBRID_AUTH_OPTIONS)
    options: TwitchAuthModuleOptions,
    private jwtAuthService: JwtAuthService,
  ) {
    super(
      merge(options, {
        passReqToCallback: true,
      }) as TwitchAuthModuleOptions,
    );
  }

  async validate(originalRequest: any, accessToken: string, refreshToken: string, profile: any) {
    const i18nContext = getI18nContextFromRequest(originalRequest);
    const { lang } = i18nContext;
    let user: UserAvailable;

    try {
      user = await this.jwtAuthService.findOrCreate(lang, profile);
    } catch (e) {
      throw convertToHttpException(e);
    }

    if (!user) {
      throw new UnauthorizedException();
    }

    const result: TwitchAuthResult = {
      originalRequest,
      accessToken,
      refreshToken,
      profile,
    };

    return result;
  }
}
