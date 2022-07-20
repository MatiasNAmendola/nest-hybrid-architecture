import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig, getGitHubOptions } from '../../../../config';
import { GithubAuthModuleOptions, GithubAuthModuleOptionsFactory } from './index';

@Injectable()
export class GithubAuthConfig implements GithubAuthModuleOptionsFactory {
  constructor(private configService: ConfigService<AppConfig>) {}

  createModuleOptions(): GithubAuthModuleOptions {
    return getGitHubOptions(this.configService);
  }
}
