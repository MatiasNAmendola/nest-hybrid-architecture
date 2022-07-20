import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfig } from './env.interfaces';
import { getDatabaseConnectionOptions } from './env.shortcuts';
import merge from 'lodash.merge';

export const ormOptions: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService<AppConfig>) => {
    return merge(getDatabaseConnectionOptions(configService), { logging: false });
  },
  inject: [ConfigService],
};
