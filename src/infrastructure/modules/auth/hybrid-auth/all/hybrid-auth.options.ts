import {
  ModuleOptionsFactory as IdentityModuleOptionsFactory,
  ModuleAsyncOptions as IdentityModuleAsyncOptions,
} from '../core';
import { GoogleAuthModuleOptions } from '../google';
import { TwitterAuthModuleOptions } from '../twitter';
import { LinkedinAuthModuleOptions } from '../linkedin';
import { FacebookAuthModuleOptions } from '../facebook';
import { InstagramAuthModuleOptions } from '../instagram';
import { GithubAuthModuleOptions } from '../github';
import { TwitchAuthModuleOptions } from '../twitch';
import { OktaAuthModuleOptions } from '../okta';
import { DiscordAuthModuleOptions } from '../discord';

export interface HybridAuthModuleOptions {
  google?: GoogleAuthModuleOptions;
  twitter?: TwitterAuthModuleOptions;
  linkedin?: LinkedinAuthModuleOptions;
  facebook?: FacebookAuthModuleOptions;
  instagram?: InstagramAuthModuleOptions;
  github?: GithubAuthModuleOptions;
  twitch?: TwitchAuthModuleOptions;
  okta?: OktaAuthModuleOptions;
  discord?: DiscordAuthModuleOptions;
}

export interface HybridAuthModuleAsyncOptions {
  google?: IdentityModuleAsyncOptions<IdentityModuleOptionsFactory<GoogleAuthModuleOptions>, GoogleAuthModuleOptions>;
  twitter?: IdentityModuleAsyncOptions<
    IdentityModuleOptionsFactory<TwitterAuthModuleOptions>,
    TwitterAuthModuleOptions
  >;
  linkedin?: IdentityModuleAsyncOptions<
    IdentityModuleOptionsFactory<LinkedinAuthModuleOptions>,
    LinkedinAuthModuleOptions
  >;
  facebook?: IdentityModuleAsyncOptions<
    IdentityModuleOptionsFactory<FacebookAuthModuleOptions>,
    FacebookAuthModuleOptions
  >;
  instagram?: IdentityModuleAsyncOptions<
    IdentityModuleOptionsFactory<InstagramAuthModuleOptions>,
    InstagramAuthModuleOptions
  >;
  github?: IdentityModuleAsyncOptions<IdentityModuleOptionsFactory<GithubAuthModuleOptions>, GithubAuthModuleOptions>;
  twitch?: IdentityModuleAsyncOptions<IdentityModuleOptionsFactory<TwitchAuthModuleOptions>, TwitchAuthModuleOptions>;
  okta?: IdentityModuleAsyncOptions<IdentityModuleOptionsFactory<OktaAuthModuleOptions>, OktaAuthModuleOptions>;
  discord?: IdentityModuleAsyncOptions<
    IdentityModuleOptionsFactory<DiscordAuthModuleOptions>,
    DiscordAuthModuleOptions
  >;
}
