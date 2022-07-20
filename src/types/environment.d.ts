export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV?: 'test' | 'development' | 'docker' | 'integration' | 'production';
      NODE_PORT?: number;
      AUTH_APIKEY?: string;
      COOKIE_SECRET?: string;
      DATABASE_HOST?: string;
      DATABASE_NAME?: string;
      DATABASE_USER?: string;
      DATABASE_PASS?: string;
      DATABASE_PORT?: number;
      JWT_SECRET?: string;
      JWT_EXPIRATION_TIME_SECONDS?: string;
      GITHUB_OAUTH_CLIENT_ID?: string;
      GITHUB_OAUTH_CLIENT_SECRET?: string;
      GITHUB_OAUTH_CALLBACK_URL?: string;
      GOOGLE_OAUTH_CLIENT_ID?: string;
      GOOGLE_OAUTH_CLIENT_SECRET?: string;
      GOOGLE_OAUTH_CALLBACK_URL?: string;
      FACEBOOK_OAUTH_CLIENT_ID?: string;
      FACEBOOK_OAUTH_CLIENT_SECRET?: string;
      FACEBOOK_OAUTH_CALLBACK_URL?: string;
      EMAILS_APIKEY_PUBLIC?: string;
      EMAILS_APIKEY_PRIVATE?: string;
      EMAILS_FROM_EMAIL?: string;
      EMAILS_FROM_NAME?: string;
    }
  }
}
