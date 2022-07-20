import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { getI18nContextFromRequest } from 'nestjs-i18n';
import { convertToHttpException } from '../../../../errors';
import { UserAvailable } from '../../user';
import { Strategy } from 'passport-google-oauth20';
import merge from 'lodash.merge';
import { JwtAuthService } from '../../jwt-auth';
import { GoogleAuthModuleOptions, GoogleAuthResult } from './google.types';
import { GOOGLE_HYBRID_AUTH_OPTIONS } from './google.constants';

@Injectable()
export class GoogleAuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(GOOGLE_HYBRID_AUTH_OPTIONS) options: GoogleAuthModuleOptions,
    private jwtAuthService: JwtAuthService,
  ) {
    super(merge(options, { passReqToCallback: true }) as GoogleAuthModuleOptions);
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

    const result: GoogleAuthResult = {
      originalRequest,
      accessToken,
      refreshToken,
      profile,
    };

    return result;
  }
}
