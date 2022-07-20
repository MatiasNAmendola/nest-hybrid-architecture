import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export interface NodeOptions {
  port: number;
}

export interface AuthOptions {
  apiKey: string;
}

export interface CookieOptions {
  secret: string;
}

export interface JwtOptions {
  secret: string;
  signOptions: { expiresIn: string };
}

export interface SsoOptions {
  clientID: string;
  clientSecret: string;
  callbackURL: string;
}

export interface EmailsOptions {
  apiKey: string;
  apiSecret: string;
  fromEmail: string;
  fromName: string;
}

export interface AppConfig {
  NodeOptions: NodeOptions;
  AuthOptions: AuthOptions;
  CookieOptions: CookieOptions;
  OrmOptions: TypeOrmModuleOptions;
  JwtOptions: JwtOptions;
  GitHubOptions: SsoOptions;
  GoogleOptions: SsoOptions;
  FacebookOptions: SsoOptions;
  EmailsOptions: EmailsOptions;
}
