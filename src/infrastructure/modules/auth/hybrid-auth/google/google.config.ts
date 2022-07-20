import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig, getGoogleOptions } from '../../../../config';
import { GoogleAuthModuleOptions, GoogleAuthModuleOptionsFactory } from './index';

@Injectable()
export class GoogleAuthConfig implements GoogleAuthModuleOptionsFactory {
  constructor(private configService: ConfigService<AppConfig>) {}

  createModuleOptions(): GoogleAuthModuleOptions {
    return getGoogleOptions(this.configService);
  }
}
