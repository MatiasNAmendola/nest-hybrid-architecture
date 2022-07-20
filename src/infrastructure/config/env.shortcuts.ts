import { ConfigService } from '@nestjs/config';
import { EnvObjects } from './env.enums';
import {
  AppConfig,
  CookieOptions,
  SsoOptions,
  JwtOptions,
  EmailsOptions,
  NodeOptions,
  AuthOptions,
} from './env.interfaces';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getNodeOptions = (configService: ConfigService<AppConfig>): NodeOptions =>
  configService.get<NodeOptions>(EnvObjects.NODE_OPTIONS);

export const getAuthOptions = (configService: ConfigService<AppConfig>): AuthOptions =>
  configService.get<AuthOptions>(EnvObjects.AUTH_OPTIONS);

export const getCookieOptions = (configService: ConfigService<AppConfig>): CookieOptions =>
  configService.get<CookieOptions>(EnvObjects.COOKIE_OPTIONS);

export const getDatabaseConnectionOptions = (configService: ConfigService<AppConfig>): TypeOrmModuleOptions =>
  configService.get<TypeOrmModuleOptions>(EnvObjects.ORM_OPTIONS);

export const getJwtOptions = (configService: ConfigService<AppConfig>): JwtOptions =>
  configService.get<JwtOptions>(EnvObjects.JWT_OPTIONS);

export const getGitHubOptions = (configService: ConfigService<AppConfig>): SsoOptions =>
  configService.get<SsoOptions>(EnvObjects.GITHUB_OPTIONS);

export const getGoogleOptions = (configService: ConfigService<AppConfig>): SsoOptions =>
  configService.get<SsoOptions>(EnvObjects.GOOGLE_OPTIONS);

export const getFacebookOptions = (configService: ConfigService<AppConfig>): SsoOptions =>
  configService.get<SsoOptions>(EnvObjects.FACEBOOK_OPTIONS);

export const getEmailsOptions = (configService: ConfigService<AppConfig>): EmailsOptions =>
  configService.get<EmailsOptions>(EnvObjects.EMAILS_OPTIONS);
