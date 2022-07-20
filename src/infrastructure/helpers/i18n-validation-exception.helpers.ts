import { ValidationError } from '@nestjs/common';
import { I18nContext, I18nValidationError, I18nValidationException } from 'nestjs-i18n';
import iterate from 'iterare';

export type Only<T, U> = {
  [P in keyof T]: T[P];
} & {
  [P in keyof U]?: never;
};

export type Either<T, U> = Only<T, U> | Only<U, T>;

export interface I18nValidationExceptionFilterDetailedErrorsOption {
  detailedErrors?: boolean;
}

export interface I18nValidationExceptionFilterErrorFormatterOption {
  errorFormatter?: (errors: ValidationError[]) => object;
}

export type I18nValidationExceptionFilterOptions = Either<
  I18nValidationExceptionFilterDetailedErrorsOption,
  I18nValidationExceptionFilterErrorFormatterOption
>;

export class I18nValidationExceptionTranslator {
  constructor(
    private readonly options: I18nValidationExceptionFilterOptions = {
      detailedErrors: true,
    },
  ) {}

  public translateException(exception: I18nValidationException, i18n: I18nContext): I18nValidationError[] {
    return this.translateErrors(exception.errors ?? [], i18n);
  }

  protected translateErrors(errors: I18nValidationError[], i18n: I18nContext): I18nValidationError[] {
    return errors.map((error) => {
      error.children = this.translateErrors(error.children ?? [], i18n);
      error.constraints = Object.keys(error.constraints).reduce((result, key) => {
        const [translationKey, argsString] = error.constraints[key].split('|');
        const args = argsString ? JSON.parse(argsString) : {};
        result[key] = i18n.t(translationKey, {
          args: { property: error.property, ...args },
        });
        return result;
      }, {});
      return error;
    });
  }

  public normalizeValidationErrors(validationErrors: ValidationError[]): string[] | I18nValidationError[] | object {
    switch (true) {
      case !this.options.detailedErrors && !('errorFormatter' in this.options):
        return this.flattenValidationErrors(validationErrors);
      case !this.options.detailedErrors && 'errorFormatter' in this.options:
        return this.options.errorFormatter(validationErrors);
      default:
        return validationErrors;
    }
  }

  protected flattenValidationErrors(validationErrors: ValidationError[]): string[] {
    return iterate(validationErrors)
      .map((error) => mapChildrenToValidationErrors(error))
      .flatten()
      .filter((item) => !!item.constraints)
      .map((item) => Object.values(item.constraints))
      .flatten()
      .toArray();
  }
}

export const mapChildrenToValidationErrors = (error: ValidationError, parentPath?: string): ValidationError[] => {
  if (!(error.children && error.children.length)) {
    return [error];
  }
  const validationErrors = [];
  parentPath = parentPath ? `${parentPath}.${error.property}` : error.property;
  for (const item of error.children) {
    if (item.children && item.children.length) {
      validationErrors.push(...mapChildrenToValidationErrors(item, parentPath));
    }
    validationErrors.push(prependConstraintsWithParentProp(parentPath, item));
  }
  return validationErrors;
};

const prependConstraintsWithParentProp = (parentPath: string, error: ValidationError): ValidationError => {
  const constraints = {};
  for (const key in error.constraints) {
    constraints[key] = `${parentPath}.${error.constraints[key]}`;
  }
  return {
    ...error,
    constraints,
  };
};
