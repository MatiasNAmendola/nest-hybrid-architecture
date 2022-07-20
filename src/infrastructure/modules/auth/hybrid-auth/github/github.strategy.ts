import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { getI18nContextFromRequest } from 'nestjs-i18n';
import { convertToHttpException } from '../../../../errors';
import { UserAvailable } from '../../user';
import { Strategy } from 'passport-github';
import merge from 'lodash.merge';
import { JwtAuthService } from '../../jwt-auth';
import { GithubAuthModuleOptions, GithubAuthResult } from './github.types';
import { GITHUB_HYBRID_AUTH_OPTIONS } from './github.constants';

@Injectable()
export class GithubAuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(GITHUB_HYBRID_AUTH_OPTIONS) options: GithubAuthModuleOptions,
    private jwtAuthService: JwtAuthService,
  ) {
    super(merge(options, { passReqToCallback: true }) as GithubAuthModuleOptions);
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

    const result: GithubAuthResult = {
      originalRequest,
      accessToken,
      refreshToken,
      profile,
    };

    return result;
  }
}
