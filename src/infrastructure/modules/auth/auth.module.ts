import { DynamicModule, Module, Provider } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthOptions } from '../../config';
import { UsersModule } from './user';
import { JwtAuthModule } from './jwt-auth';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { AuthOptionsAsync } from './auth.interfaces';
import { AUTH_CONFIGURATION } from './auth.constants';

@Module({})
export class AuthModule {
  public static forRoot(config: AuthOptions): DynamicModule {
    return {
      global: true,
      module: AuthModule,
      imports: [PassportModule, JwtAuthModule, UsersModule],
      controllers: [AuthController],
      providers: [{ provide: AUTH_CONFIGURATION, useValue: config }, LocalStrategy, AuthService],
      exports: [AuthService],
    };
  }

  public static forRootAsync(config: AuthOptionsAsync): DynamicModule {
    return {
      global: true,
      module: AuthModule,
      controllers: [AuthController],
      imports: [PassportModule, JwtAuthModule, UsersModule], // config.imports ||
      providers: [this.createAsyncProviders(config), LocalStrategy, AuthService],
      exports: [AuthService],
    };
  }

  private static createAsyncProviders(options: AuthOptionsAsync): Provider {
    return {
      provide: AUTH_CONFIGURATION,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };
  }
}
