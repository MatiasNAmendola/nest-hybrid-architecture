import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppConfig, getJwtOptions } from '../../../config';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthService } from './jwt-auth.service';
import { UsersModule } from '../user';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService<AppConfig>) => {
        const { secret, signOptions } = getJwtOptions(configService);
        return { secret, signOptions };
      },
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  providers: [JwtStrategy, JwtAuthService],
  exports: [JwtAuthService],
})
export class JwtAuthModule {}
