import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { getI18nContextFromRequest } from 'nestjs-i18n';
import { convertToHttpException } from '../../../../errors';
import { UserAvailable } from '../../user';
import { Strategy } from 'passport-linkedin-oauth2';
import merge from 'lodash.merge';
import { JwtAuthService } from '../../jwt-auth';
import { LinkedinAuthModuleOptions, LinkedinAuthResult } from './linkedin.types';
import { LINKEDIN_HYBRID_AUTH_OPTIONS } from './linkedin.constants';

@Injectable()
export class LinkedinAuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(LINKEDIN_HYBRID_AUTH_OPTIONS)
    options: LinkedinAuthModuleOptions,
    private jwtAuthService: JwtAuthService,
  ) {
    super(
      merge(options, {
        passReqToCallback: true,
      }) as LinkedinAuthModuleOptions,
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

    const result: LinkedinAuthResult = {
      originalRequest,
      accessToken,
      refreshToken,
      profile,
    };

    return result;
  }
}
