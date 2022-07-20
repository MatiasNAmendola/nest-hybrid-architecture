import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { getI18nContextFromArgumentsHost, I18nValidationException } from 'nestjs-i18n';
import { I18nValidationExceptionFilterOptions, I18nValidationExceptionTranslator, setPoweredBy } from '../helpers';

/**
 * Convert exceptions to JSON readable format
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly translator: I18nValidationExceptionTranslator;

  constructor(
    options: I18nValidationExceptionFilterOptions = {
      detailedErrors: true,
    },
  ) {
    this.translator = new I18nValidationExceptionTranslator(options);
  }

  catch(error: any, host: ArgumentsHost) {
    const i18n = getI18nContextFromArgumentsHost(host);
    const { lang } = i18n;
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const req = ctx.getRequest();

    setPoweredBy(res);

    let status: number = HttpStatus.INTERNAL_SERVER_ERROR;

    if (!isNaN(error.getStatus()) && error.getStatus() in HttpStatus) {
      status = error.getStatus();
    }

    if (status === HttpStatus.UNAUTHORIZED) {
      error.message = i18n.t('test.UNAUTHORIZED_ACCESS', { lang });
    }

    let errors;

    if (error instanceof I18nValidationException) {
      errors = this.translator.translateException(error, i18n);
    }

    let exception: string;

    if (typeof error.response == 'string') {
      exception = error.response;
    } else {
      exception = error.response.name || error.response.error || error.name;
    }

    // Manage errors from class-validator
    if (
      Array.isArray(error.response.message) &&
      error.response.message.length > 0 &&
      error.response.message[0].constraints
    ) {
      errors = error.response.message;
    }

    if (Array.isArray(error.errors) && error.errors.length > 0 && error.errors[0].constraints) {
      errors = error.errors;
    }

    if (Array.isArray(errors)) {
      errors = this.translator.normalizeValidationErrors(errors);

      errors = errors.map((e) => {
        return formatErrorItem(e);
      });
    }

    res.status(status).send({
      statusCode: error.getStatus(),
      error: exception,
      message: error.message,
      errors,
      timestamp: new Date().toISOString(),
      path: req ? req.url : null,
      lang: i18n.lang,
    });
  }
}

function formatErrorItem(e: { property: string; constraints: any }) {
  const constraints = Object.keys(e.constraints).map((key) => {
    return {
      constraint: key,
      details: e.constraints[key],
    };
  });

  return { field: e.property, constraints };
}
