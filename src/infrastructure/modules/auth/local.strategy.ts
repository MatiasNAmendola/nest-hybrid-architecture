import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { getI18nContextFromRequest, I18nService } from 'nestjs-i18n';
import { Request } from 'express';
import { ValidationsService } from '../validations';
import { convertToHttpException } from '../../errors';
import { LoginDTO, UsersService } from './user';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly i18n: I18nService,
    private readonly validationService: ValidationsService,
    private readonly usersService: UsersService,
  ) {
    super({
      passReqToCallback: true,
    });
  }

  async validate(request: Request, username: string, password: string): Promise<any> {
    const i18nContext = getI18nContextFromRequest(request);
    const { lang } = i18nContext;

    const dto = new LoginDTO();
    dto.username = username;
    dto.password = password;

    await this.validationService.validateObject(lang, dto);

    try {
      return await this.usersService.findWithCredentials(lang, dto);
    } catch (e) {
      throw convertToHttpException(e);
    }
  }
}
