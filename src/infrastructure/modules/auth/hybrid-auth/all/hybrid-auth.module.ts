import { Module, DynamicModule } from '@nestjs/common';
import { JwtAuthModule } from '../../jwt-auth';
import { GoogleAuthController, GoogleAuthModule } from '../google';
import { TwitterAuthModule } from '../twitter';
import { LinkedinAuthModule } from '../linkedin';
import { FacebookAuthController, FacebookAuthModule } from '../facebook';
import { InstagramAuthModule } from '../instagram';
import { GithubAuthController, GithubAuthModule } from '../github';
import { TwitchAuthModule } from '../twitch';
import { OktaAuthModule } from '../okta';
import { DiscordAuthModule } from '../discord';
import { HybridAuthModuleOptions, HybridAuthModuleAsyncOptions } from './hybrid-auth.options';

function createHybridAuthImports(options: HybridAuthModuleOptions): any[] {
  const modules: any[] = [JwtAuthModule];
  modules.push(
    [
      options.google && GoogleAuthModule.forRoot(options.google),
      options.twitter && TwitterAuthModule.forRoot(options.twitter),
      options.linkedin && LinkedinAuthModule.forRoot(options.linkedin),
      options.facebook && FacebookAuthModule.forRoot(options.facebook),
      options.instagram && InstagramAuthModule.forRoot(options.instagram),
      options.github && GithubAuthModule.forRoot(options.github),
      options.twitch && TwitchAuthModule.forRoot(options.twitch),
      options.okta && OktaAuthModule.forRoot(options.okta),
      options.discord && DiscordAuthModule.forRoot(options.discord),
    ].filter(Boolean),
  );

  return modules;
}

@Module({})
export class HybridAuthModule {
  static forRoot(options: HybridAuthModuleOptions): DynamicModule {
    return {
      global: true,
      module: HybridAuthModule,
      imports: createHybridAuthImports(options),
      controllers: [FacebookAuthController, GithubAuthController, GoogleAuthController],
    };
  }

  static forRootAsync(options: HybridAuthModuleAsyncOptions): DynamicModule {
    const imports: any[] = [JwtAuthModule];

    if (options.facebook) {
      imports.push(FacebookAuthModule.forRootAsync(options.facebook));
    }

    if (options.google) {
      imports.push(GoogleAuthModule.forRootAsync(options.google));
    }

    if (options.github) {
      imports.push(GithubAuthModule.forRootAsync(options.github));
    }

    if (options.linkedin) {
      imports.push(LinkedinAuthModule.forRootAsync(options.linkedin));
    }

    if (options.twitter) {
      imports.push(TwitterAuthModule.forRootAsync(options.twitter));
    }

    if (options.instagram) {
      imports.push(InstagramAuthModule.forRootAsync(options.instagram));
    }

    if (options.twitch) {
      imports.push(TwitchAuthModule.forRootAsync(options.twitch));
    }

    if (options.okta) {
      imports.push(OktaAuthModule.forRootAsync(options.okta));
    }

    if (options.discord) {
      imports.push(DiscordAuthModule.forRootAsync(options.discord));
    }

    return {
      module: HybridAuthModule,
      imports,
      controllers: [FacebookAuthController, GithubAuthController, GoogleAuthController],
    };
  }
}
