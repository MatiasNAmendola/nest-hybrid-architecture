import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class IndexService {
  constructor(private readonly i18n: I18nService) {}

  getHello(lang: string): string {
    return this.i18n.t('test.HELLO', { lang });
  }
}
