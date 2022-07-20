import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { getI18nContextFromRequest } from 'nestjs-i18n';
import { convertToHttpException } from '../../../../errors';
import { UserAvailable } from '../../user';
import { Strategy } from 'passport-facebook';
import merge from 'lodash.merge';
import { JwtAuthService } from '../../jwt-auth';
import { FacebookAuthModuleOptions, FacebookAuthResult } from './facebook.types';
import { FACEBOOK_HYBRID_AUTH_OPTIONS } from './facebook.constants';

@Injectable()
export class FacebookAuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(FACEBOOK_HYBRID_AUTH_OPTIONS) options: FacebookAuthModuleOptions,
    private jwtAuthService: JwtAuthService,
  ) {
    super(
      merge(options, {
        passReqToCallback: true,
      }) as FacebookAuthModuleOptions,
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

    const result: FacebookAuthResult = {
      originalRequest,
      accessToken,
      refreshToken,
      profile,
    };

    return result;
  }
}
