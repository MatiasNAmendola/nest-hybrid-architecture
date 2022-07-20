import { BusinessError } from './business.error';

export class InvalidResetPasswordCode extends BusinessError {
  constructor(message: string) {
    super('INVALID_RESET_PASSWORD_CODE', message);
  }
}
