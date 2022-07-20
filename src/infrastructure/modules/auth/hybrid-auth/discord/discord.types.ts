import { Request } from 'express';
import { StrategyOptions, StrategyOptionsWithRequest, Profile } from 'passport-discord';

type DiscordAuthStrategyOptionsWithoutRequest = {
  [K in keyof StrategyOptions]: StrategyOptions[K];
};

type DiscordAuthStrategyOptionsWithRequest = {
  [K in keyof StrategyOptionsWithRequest]: StrategyOptionsWithRequest[K];
};

export type DiscordAuthModuleOptions = DiscordAuthStrategyOptionsWithoutRequest | DiscordAuthStrategyOptionsWithRequest;

// eslint-disable-next-line @typescript-eslint/ban-types
export type DiscordAuthGuardOptions = Object;

export const discordGuardDefaultOptions = {};

export interface DiscordAuthModuleOptionsFactory {
  createModuleOptions(): Promise<DiscordAuthModuleOptions> | DiscordAuthModuleOptions;
}

export interface DiscordAuthResult {
  originalRequest: Request;
  accessToken: string;
  refreshToken: string;
  profile: Profile;
}
