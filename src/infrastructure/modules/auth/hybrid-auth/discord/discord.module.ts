import { DiscordAuthStrategy } from './discord.strategy';
import { DiscordAuthModuleOptions } from './discord.types';
import { DISCORD_HYBRID_AUTH_OPTIONS } from './discord.constants';
import { createHybridAuthModule, INestHybridAuthModule } from '../core';

export const DiscordAuthModule: INestHybridAuthModule<DiscordAuthModuleOptions> =
  createHybridAuthModule<DiscordAuthModuleOptions>(DISCORD_HYBRID_AUTH_OPTIONS, DiscordAuthStrategy);
