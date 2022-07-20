import { ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Req, Res } from '@nestjs/common';
import { I18nLang, I18nService } from 'nestjs-i18n';
import { Response } from 'express';
import { ValidationsService } from '../../../validations';
import { BasicOpenApiTags } from '../../../../config';
import { JwtAuthService, JwtPayload, JWT_COOKIE_NAME } from '../../jwt-auth';
import { UseDiscordAuth } from './discord.guard';
import { DiscordAuthResult } from './discord.types';

const summary = 'Login with Discord';

@ApiTags(BasicOpenApiTags.HybridAuth)
@Controller('auth/discord')
export class DiscordAuthController {
  constructor(
    private readonly jwtAuthService: JwtAuthService,
    private readonly validations: ValidationsService,
    private readonly i18n: I18nService,
  ) {}

  @UseDiscordAuth()
  @Get()
  @ApiOperation({ summary })
  loginWithDiscord() {
    return summary;
  }

  @UseDiscordAuth()
  @Get('callback')
  @ApiExcludeEndpoint()
  discordCallback(@I18nLang() lang: string, @Req() req, @Res({ passthrough: true }) res: Response) {
    const result: DiscordAuthResult = req.hybridAuthResult;
    const payload: JwtPayload = this.jwtAuthService.generatePayloadFromProfile(result.profile);
    const { accessToken } = this.jwtAuthService.generateJwt(payload);
    res.cookie(JWT_COOKIE_NAME, accessToken);

    lang = this.validations.getValidLangOrDefault(lang);
    return this.i18n.t('test.THANKS_SIGN_IN', { lang });
  }
}
