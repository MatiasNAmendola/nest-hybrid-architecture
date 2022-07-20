import { DynamicModule, Module, Provider } from '@nestjs/common';
import type { EmailsOptionsAsync } from './emails.interfaces';
import { EMAILS_CONFIGURATION } from './emails.constants';
import { EmailsService } from './emails.service';
import { EmailsOptions } from '../../../config';

@Module({ exports: [EmailsService] })
export class EmailsModule {
  public static forRoot(config: EmailsOptions): DynamicModule {
    return {
      global: true,
      module: EmailsModule,
      //   controllers: [
      //     ...controllers,
      //   ],
      providers: [{ provide: EMAILS_CONFIGURATION, useValue: config }, EmailsService],
      exports: [EmailsService],
    };
  }

  public static forRootAsync(config: EmailsOptionsAsync): DynamicModule {
    return {
      global: true,
      module: EmailsModule,
      //   controllers: [
      //     ...controllers,
      //   ],
      imports: config.imports || [],
      providers: [this.createAsyncProviders(config), EmailsService],
      exports: [EmailsService],
    };
  }

  private static createAsyncProviders(options: EmailsOptionsAsync): Provider {
    return {
      provide: EMAILS_CONFIGURATION,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };
  }
}
