import { Request } from 'express';
import { StrategyOptions, StrategyOptionsWithRequest, Profile } from 'passport-github';

type GithubAuthStrategyOptionsWithoutRequest = {
  [K in keyof StrategyOptions]: StrategyOptions[K];
};

type GithubAuthStrategyOptionsWithRequest = {
  [K in keyof StrategyOptionsWithRequest]: StrategyOptionsWithRequest[K];
};

export type GithubAuthModuleOptions = GithubAuthStrategyOptionsWithoutRequest | GithubAuthStrategyOptionsWithRequest;

// eslint-disable-next-line @typescript-eslint/ban-types
export type GithubAuthGuardOptions = Object;

export const githubGuardDefaultOptions = {};

export interface GithubAuthModuleOptionsFactory {
  createModuleOptions(): Promise<GithubAuthModuleOptions> | GithubAuthModuleOptions;
}

export interface GithubAuthResult {
  originalRequest: Request;
  accessToken: string;
  refreshToken: string;
  profile: Profile;
}
