import { BusinessError } from './business.error';

export class InvalidActivationCode extends BusinessError {
  constructor(message: string) {
    super('INVALID_ACTIVATION_CODE', message);
  }
}
