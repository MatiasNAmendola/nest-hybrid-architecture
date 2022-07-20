import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { getI18nContextFromRequest } from 'nestjs-i18n';
import { convertToHttpException } from '../../../../errors';
import { UserAvailable } from '../../user';
import { Strategy } from 'passport-twitter';
import merge from 'lodash.merge';
import { JwtAuthService } from '../../jwt-auth';
import { TwitterAuthModuleOptions, TwitterAuthResult } from './twitter.types';
import { TWITTER_HYBRID_AUTH_OPTIONS } from './twitter.constants';

@Injectable()
export class TwitterAuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(TWITTER_HYBRID_AUTH_OPTIONS) options: TwitterAuthModuleOptions,
    private jwtAuthService: JwtAuthService,
  ) {
    super(merge(options, { passReqToCallback: true }) as TwitterAuthModuleOptions);
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

    const result: TwitterAuthResult = {
      originalRequest,
      accessToken,
      refreshToken,
      profile,
    };

    return result;
  }
}
