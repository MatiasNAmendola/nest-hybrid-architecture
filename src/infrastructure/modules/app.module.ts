import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { I18nModule } from 'nestjs-i18n';
import { EmailsModule } from './notifications';
import { authOptions, configModuleOptions, i18nOptions, mailjetOptions, ormOptions } from '../config';
import { ValidationsModule } from './validations';
import { HealthModule } from './health';
import { OrmModule } from '../database';
import { AuthModule, defaultHybridAuthModuleAsyncOptions, HybridAuthModule } from './auth';
import { CrmModule, IndexModule, MoviesModule } from '../../domain/modules';

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    I18nModule.forRoot(i18nOptions),
    OrmModule.forRootAsync(ormOptions),
    EmailsModule.forRootAsync(mailjetOptions),
    AuthModule.forRootAsync(authOptions),
    HybridAuthModule.forRootAsync(defaultHybridAuthModuleAsyncOptions),
    CrmModule,
    HealthModule,
    IndexModule,
    ValidationsModule,
    MoviesModule,
  ],
})
export class AppModule {}
