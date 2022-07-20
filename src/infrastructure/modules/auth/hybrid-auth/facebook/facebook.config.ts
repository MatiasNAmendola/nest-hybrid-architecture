import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig, getFacebookOptions } from '../../../../config';
import { FacebookAuthModuleOptions, FacebookAuthModuleOptionsFactory } from './index';

@Injectable()
export class FacebookAuthConfig implements FacebookAuthModuleOptionsFactory {
  constructor(private configService: ConfigService<AppConfig>) {}

  createModuleOptions(): FacebookAuthModuleOptions {
    return getFacebookOptions(this.configService);
  }
}
