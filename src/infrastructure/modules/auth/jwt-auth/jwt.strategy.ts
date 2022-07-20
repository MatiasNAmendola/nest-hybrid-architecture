import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppConfig, getJwtOptions } from '../../../config';
import { JwtAuthService } from './jwt-auth.service';
import { JwtPayload } from './jwt-auth.types';
import { getI18nContextFromRequest } from 'nestjs-i18n/dist/utils/util';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(readonly configService: ConfigService<AppConfig>, private readonly authService: JwtAuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // Users can send us the JWT token either by a bearer token in an authorization header...
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        // ... or in a cookie named "jwt"
        (request) => request?.cookies?.jwt,
      ]),
      ignoreExpiration: false,
      secretOrKey: getJwtOptions(configService).secret,
      passReqToCallback: true,
    });
  }

  async validate(originalRequest: any, payload: JwtPayload) {
    const i18n = getI18nContextFromRequest(originalRequest);
    const { lang } = i18n;
    return this.authService.validatePayload(lang, payload);
  }
}
