export enum NodeEnv {
  test = 'test',
  development = 'development',
  docker = 'docker',
  integration = 'integration',
  production = 'production',
}

export enum EnvObjects {
  NODE_OPTIONS = 'NodeOptions',
  AUTH_OPTIONS = 'AuthOptions',
  COOKIE_OPTIONS = 'CookieOptions',
  ORM_OPTIONS = 'OrmOptions',
  JWT_OPTIONS = 'JwtOptions',
  GITHUB_OPTIONS = 'GitHubOptions',
  GOOGLE_OPTIONS = 'GoogleOptions',
  FACEBOOK_OPTIONS = 'FacebookOptions',
  EMAILS_OPTIONS = 'EmailsOptions',
}

export enum BasicOpenApiTags {
  Main = 'Main',
  LocalAuth = 'Local authorization',
  HybridAuth = 'Hybrid authorization',
}
