import { ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Req, Res } from '@nestjs/common';
import { I18nLang, I18nService } from 'nestjs-i18n';
import { Response } from 'express';
import { Profile } from 'passport';
import { ValidationsService } from '../../../validations';
import { BasicOpenApiTags } from '../../../../config';
import { JwtAuthService, JwtPayload, JWT_COOKIE_NAME } from '../../jwt-auth';
import { UseOktaAuth } from './okta.guard';
import { OktaAuthResult } from './okta.types';

const summary = 'Login with Okta';

@ApiTags(BasicOpenApiTags.HybridAuth)
@Controller('auth/okta')
export class OktaAuthController {
  constructor(
    private readonly jwtAuthService: JwtAuthService,
    private readonly validations: ValidationsService,
    private readonly i18n: I18nService,
  ) {}

  @UseOktaAuth()
  @Get()
  @ApiOperation({ summary })
  loginWithDiscord() {
    return summary;
  }

  @UseOktaAuth()
  @Get('callback')
  @ApiExcludeEndpoint()
  oktaCallback(@I18nLang() lang: string, @Req() req, @Res({ passthrough: true }) res: Response) {
    const result: OktaAuthResult = req.hybridAuthResult;
    const { id, username, displayName, email } = result.profile;

    const profile: Profile = {
      provider: 'okta',
      id,
      username,
      displayName,
      emails: [{ value: email }],
    };

    const payload: JwtPayload = this.jwtAuthService.generatePayloadFromProfile(profile);
    const { accessToken } = this.jwtAuthService.generateJwt(payload);
    res.cookie(JWT_COOKIE_NAME, accessToken);

    lang = this.validations.getValidLangOrDefault(lang);
    return this.i18n.t('test.THANKS_SIGN_IN', { lang });
  }
}
