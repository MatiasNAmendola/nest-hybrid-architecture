import { ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Req, Res } from '@nestjs/common';
import { I18nLang, I18nService } from 'nestjs-i18n';
import { Response } from 'express';
import { Profile } from 'passport';
import { ValidationsService } from '../../../validations';
import { BasicOpenApiTags } from '../../../../config';
import { JwtAuthService, JwtPayload, JWT_COOKIE_NAME } from '../../jwt-auth';
import { UseTwitchAuth } from './twitch.guard';
import { TwitchAuthResult } from './twitch.types';

const summary = 'Login with Twitch';

@ApiTags(BasicOpenApiTags.HybridAuth)
@Controller('auth/twitch')
export class TwitchAuthController {
  constructor(
    private readonly jwtAuthService: JwtAuthService,
    private readonly validations: ValidationsService,
    private readonly i18n: I18nService,
  ) {}

  @UseTwitchAuth()
  @Get()
  @ApiOperation({ summary })
  loginWithDiscord() {
    return summary;
  }

  @UseTwitchAuth()
  @Get('callback')
  @ApiExcludeEndpoint()
  twitchCallback(@I18nLang() lang: string, @Req() req, @Res({ passthrough: true }) res: Response) {
    const result: TwitchAuthResult = req.hybridAuthResult;
    const { provider, id, login: username, display_name: displayName } = result.profile;

    const profile: Profile = {
      provider,
      id,
      username,
      displayName,
    };

    const payload: JwtPayload = this.jwtAuthService.generatePayloadFromProfile(profile);
    const { accessToken } = this.jwtAuthService.generateJwt(payload);
    res.cookie(JWT_COOKIE_NAME, accessToken);

    lang = this.validations.getValidLangOrDefault(lang);
    return this.i18n.t('test.THANKS_SIGN_IN', { lang });
  }
}
