import { expandEnvVariables } from '../helpers';
import { AppConfig } from './env.interfaces';

expandEnvVariables();

export const configuration = (): AppConfig => ({
  NodeOptions: {
    port: process.env.NODE_PORT || 5000,
  },
  AuthOptions: {
    apiKey: process.env.AUTH_APIKEY,
  },
  CookieOptions: {
    secret: process.env.COOKIE_SECRET,
  },
  OrmOptions: {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE_NAME,
    autoLoadEntities: true,
    synchronize:
      process.env.NODE_ENV === 'development' ||
      process.env.NODE_ENV === 'docker' ||
      process.env.NODE_ENV === 'integration' ||
      process.env.NODE_ENV === 'test',
  },
  JwtOptions: {
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME_SECONDS },
  },
  GitHubOptions: {
    clientID: process.env.GITHUB_OAUTH_CLIENT_ID,
    clientSecret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_OAUTH_CALLBACK_URL,
  },
  GoogleOptions: {
    clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_OAUTH_CALLBACK_URL,
  },
  FacebookOptions: {
    clientID: process.env.FACEBOOK_OAUTH_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_OAUTH_CLIENT_SECRET,
    callbackURL: process.env.FACEBOOK_OAUTH_CALLBACK_URL,
  },
  EmailsOptions: {
    apiKey: process.env.EMAILS_APIKEY_PUBLIC,
    apiSecret: process.env.EMAILS_APIKEY_PRIVATE,
    fromEmail: process.env.EMAILS_FROM_EMAIL,
    fromName: process.env.EMAILS_FROM_NAME,
  },
});
