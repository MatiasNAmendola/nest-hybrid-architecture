import { Injectable, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import merge from 'lodash.merge';
import { DiscordAuthGuardOptions, discordGuardDefaultOptions } from './discord.types';

@Injectable()
class DiscordAuthGuard extends AuthGuard('discord') {
  constructor(options?: DiscordAuthGuardOptions) {
    super(
      merge(discordGuardDefaultOptions, options, {
        property: 'hybridAuthResult',
      }),
    );
  }
}

export function UseDiscordAuth(options?: DiscordAuthGuardOptions) {
  return UseGuards(new DiscordAuthGuard(options));
}
