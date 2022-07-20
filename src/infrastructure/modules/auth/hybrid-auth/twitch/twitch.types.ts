import { Request } from 'express';
import { StrategyOptions, StrategyOptionsWithRequest, TwitchProfile } from 'passport-twitch-latest';

type TwitchAuthStrategyOptionsWithoutRequest = {
  [K in keyof StrategyOptions]: StrategyOptions[K];
};

type TwitchAuthStrategyOptionsWithRequest = {
  [K in keyof StrategyOptionsWithRequest]: StrategyOptionsWithRequest[K];
};

export type TwitchAuthModuleOptions = TwitchAuthStrategyOptionsWithoutRequest | TwitchAuthStrategyOptionsWithRequest;

// eslint-disable-next-line @typescript-eslint/ban-types
export type TwitchAuthGuardOptions = Object;

export const twitchGuardDefaultOptions = {
  scope: ['user_read'],
  state: true,
};

export interface TwitchAuthModuleOptionsFactory {
  createModuleOptions(): Promise<TwitchAuthModuleOptions> | TwitchAuthModuleOptions;
}

export interface TwitchAuthResult {
  originalRequest: Request;
  accessToken: string;
  refreshToken: string;
  profile: TwitchProfile;
}
