import { readFileSync } from 'fs';
import { resolve } from 'path';
import { ValidationError, ValidationPipe } from '@nestjs/common';
import { i18nValidationErrorFactory } from 'nestjs-i18n';
import { validate } from 'class-validator-multi-lang';

/**
 * Validate query params and body
 */
export class CustomValidationPipe extends ValidationPipe {
  constructor() {
    super({
      transform: true,
      whitelist: true,
      skipMissingProperties: true,
      forbidNonWhitelisted: true,
      exceptionFactory: i18nValidationErrorFactory,
    });
  }

  protected validate(object: object, validatorOptions?: any): Promise<ValidationError[]> | ValidationError[] {
    const messages = JSON.parse(readFileSync(resolve(__dirname, `../../../i18n/nest-i18n-raw.json`)).toString());
    return validate(object, { ...validatorOptions, ...{ messages } });
  }
}
