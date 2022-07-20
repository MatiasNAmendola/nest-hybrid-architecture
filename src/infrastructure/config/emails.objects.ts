import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailsOptionsAsync } from '../modules/notifications';
import { AppConfig } from './env.interfaces';
import { getEmailsOptions } from './env.shortcuts';

export const mailjetOptions: EmailsOptionsAsync = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService<AppConfig>) => getEmailsOptions(configService),
  inject: [ConfigService],
};
