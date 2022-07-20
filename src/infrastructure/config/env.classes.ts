import { IsDefined, IsEnum, IsInt, IsString } from 'class-validator';
import { NodeEnv } from './env.enums';

export class EnvironmentVariables {
  @IsDefined()
  @IsEnum(NodeEnv)
  NODE_ENV: string;

  @IsDefined()
  @IsInt()
  NODE_PORT: number;

  @IsDefined()
  @IsString()
  AUTH_APIKEY: string;

  @IsDefined()
  @IsString()
  COOKIE_SECRET: string;

  @IsDefined()
  @IsString()
  DATABASE_HOST: string;

  @IsDefined()
  @IsString()
  DATABASE_NAME: string;

  @IsDefined()
  @IsString()
  DATABASE_USER: string;

  @IsDefined()
  @IsString()
  DATABASE_PASS: string;

  @IsDefined()
  @IsInt()
  DATABASE_PORT: number;

  @IsDefined()
  @IsString()
  JWT_SECRET: string;

  @IsDefined()
  @IsString()
  JWT_EXPIRATION_TIME_SECONDS: string;

  @IsDefined()
  @IsString()
  GITHUB_OAUTH_CLIENT_ID: string;

  @IsDefined()
  @IsString()
  GITHUB_OAUTH_CLIENT_SECRET: string;

  @IsDefined()
  @IsString()
  GITHUB_OAUTH_CALLBACK_URL: string;

  @IsDefined()
  @IsString()
  GOOGLE_OAUTH_CLIENT_ID: string;

  @IsDefined()
  @IsString()
  GOOGLE_OAUTH_CLIENT_SECRET: string;

  @IsDefined()
  @IsString()
  GOOGLE_OAUTH_CALLBACK_URL: string;

  @IsDefined()
  @IsString()
  FACEBOOK_OAUTH_CLIENT_ID: string;

  @IsDefined()
  @IsString()
  FACEBOOK_OAUTH_CLIENT_SECRET: string;

  @IsDefined()
  @IsString()
  FACEBOOK_OAUTH_CALLBACK_URL: string;

  @IsDefined()
  @IsString()
  EMAILS_APIKEY_PUBLIC: string;

  @IsDefined()
  @IsString()
  EMAILS_APIKEY_PRIVATE: string;

  @IsDefined()
  @IsString()
  EMAILS_FROM_EMAIL: string;

  @IsDefined()
  @IsString()
  EMAILS_FROM_NAME: string;
}
