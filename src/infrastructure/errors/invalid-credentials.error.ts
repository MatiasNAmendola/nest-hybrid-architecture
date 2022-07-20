import { BusinessError } from './business.error';

export class InvalidCredentials extends BusinessError {
  constructor(message: string) {
    super('INVALID_CREDENTIALS', message);
  }
}
