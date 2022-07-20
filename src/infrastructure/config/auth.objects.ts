import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthOptionsAsync } from '../modules/auth';
import { AppConfig } from './env.interfaces';
import { getAuthOptions } from './env.shortcuts';

export const authOptions: AuthOptionsAsync = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService<AppConfig>) => getAuthOptions(configService),
  inject: [ConfigService],
};
