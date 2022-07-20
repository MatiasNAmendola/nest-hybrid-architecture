import { BusinessError } from './business.error';

export class AlreadyExistsError extends BusinessError {
  constructor(message: string) {
    super('ALREADY_EXISTS', message);
  }
}
