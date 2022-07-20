import { BadRequestException, Injectable, ValidationError } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { validateSync } from 'class-validator-multi-lang';
import { readFileSync } from 'fs';
import { resolve } from 'path';

@Injectable()
export class ValidationsService {
  constructor(private readonly i18n: I18nService) {}

  public validateLang(lang: string): boolean {
    return this.i18n.getSupportedLanguages().includes(lang);
  }

  public getValidLangOrDefault(lang: string): string {
    return this.validateLang(lang) ? lang : 'en';
  }

  public validateObject<T extends object>(lang: string, object: T): void {
    lang = this.getValidLangOrDefault(lang);
    const messages = ValidationsService.getErrorMessages(lang);

    const errors: ValidationError[] = validateSync(object, {
      messages,
      skipMissingProperties: true,
      forbidNonWhitelisted: true,
      whitelist: true,
    });

    if (errors.length > 0) throw new BadRequestException(errors);
  }

  private static getErrorMessages(lang: string): { [key: string]: string } {
    return JSON.parse(readFileSync(resolve(__dirname, `../../../../i18n/${lang}/class-validator.json`)).toString());
  }
}
