import { BusinessError } from './business.error';

export class DoesNotExistError extends BusinessError {
  constructor(message: string) {
    super('DOES_NOT_EXIST', message);
  }
}
