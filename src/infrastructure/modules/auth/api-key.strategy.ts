import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig, getAuthOptions } from '../../config';
import { API_KEY } from './auth.constants';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy, API_KEY) {
  constructor(readonly configService: ConfigService<AppConfig>) {
    super({ header: 'x-api-key', prefix: '' }, true, (apikey, done) => {
      const saved = getAuthOptions(configService).apiKey;
      const checkKey = saved === apikey;

      if (!checkKey) {
        return done(new UnauthorizedException());
      }

      return done(null, true);
    });
  }
}
