import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { getI18nContextFromRequest } from 'nestjs-i18n';
import { convertToHttpException } from '../../../../errors';
import { UserAvailable } from '../../user';
import { Strategy } from 'passport-okta-oauth20';
import merge from 'lodash.merge';
import { JwtAuthService } from '../../jwt-auth';
import { OktaAuthModuleOptions, OktaAuthResult } from './okta.types';
import { OKTA_HYBRID_AUTH_OPTIONS } from './okta.constants';

@Injectable()
export class OktaAuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(OKTA_HYBRID_AUTH_OPTIONS)
    options: OktaAuthModuleOptions,
    private jwtAuthService: JwtAuthService,
  ) {
    super(
      merge(options, {
        passReqToCallback: true,
      }) as OktaAuthModuleOptions,
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

    const result: OktaAuthResult = {
      originalRequest,
      accessToken,
      refreshToken,
      profile,
    };

    return result;
  }
}
