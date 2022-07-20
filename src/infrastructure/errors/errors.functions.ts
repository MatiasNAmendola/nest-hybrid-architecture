import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { InvalidCredentials } from './invalid-credentials.error';
import { BusinessError } from './business.error';

export function convertToHttpException(e: Error): Error {
  let o: Error;

  if (e instanceof HttpException) {
    o = e;
  } else if (e instanceof InvalidCredentials) {
    o = new UnauthorizedException(e, e.message);
  } else if (e instanceof BusinessError) {
    o = new BadRequestException(e, e.message);
  } else {
    o = e;
  }

  return o;
}
