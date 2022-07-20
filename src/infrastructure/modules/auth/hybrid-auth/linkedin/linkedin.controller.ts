import { ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Req, Res } from '@nestjs/common';
import { I18nLang, I18nService } from 'nestjs-i18n';
import { Response } from 'express';
import { ValidationsService } from '../../../validations';
import { BasicOpenApiTags } from '../../../../config';
import { JwtAuthService, JwtPayload, JWT_COOKIE_NAME } from '../../jwt-auth';
import { UseLinkedinAuth } from './linkedin.guard';
import { LinkedinAuthResult } from './linkedin.types';

const summary = 'Login with Linkedin';

@ApiTags(BasicOpenApiTags.HybridAuth)
@Controller('auth/linkedin')
export class LinkedinAuthController {
  constructor(
    private readonly jwtAuthService: JwtAuthService,
    private readonly validations: ValidationsService,
    private readonly i18n: I18nService,
  ) {}

  @UseLinkedinAuth()
  @Get()
  @ApiOperation({ summary })
  loginWithDiscord() {
    return summary;
  }

  @UseLinkedinAuth()
  @Get('callback')
  @ApiExcludeEndpoint()
  linkedinCallback(@I18nLang() lang: string, @Req() req, @Res({ passthrough: true }) res: Response) {
    const result: LinkedinAuthResult = req.hybridAuthResult;
    const payload: JwtPayload = this.jwtAuthService.generatePayloadFromProfile(result.profile);
    const { accessToken } = this.jwtAuthService.generateJwt(payload);
    res.cookie(JWT_COOKIE_NAME, accessToken);

    lang = this.validations.getValidLangOrDefault(lang);
    return this.i18n.t('test.THANKS_SIGN_IN', { lang });
  }
}
