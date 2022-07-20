import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { getI18nContextFromRequest } from 'nestjs-i18n';
import { convertToHttpException } from '../../../../errors';
import { UserAvailable } from '../../user';
import { Strategy } from 'passport-instagram';
import merge from 'lodash.merge';
import { JwtAuthService } from '../../jwt-auth';
import { InstagramAuthModuleOptions, InstagramAuthResult } from './instagram.types';
import { INSTAGRAM_HYBRID_AUTH_OPTIONS } from './instagram.constants';

@Injectable()
export class InstagramAuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(INSTAGRAM_HYBRID_AUTH_OPTIONS) options: InstagramAuthModuleOptions,
    private jwtAuthService: JwtAuthService,
  ) {
    super(merge(options, { passReqToCallback: true }) as InstagramAuthModuleOptions);
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

    const result: InstagramAuthResult = {
      originalRequest,
      accessToken,
      refreshToken,
      profile,
    };

    return result;
  }
}
