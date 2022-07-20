import { BusinessError } from './business.error';

export class UserExistsError extends BusinessError {
  constructor(message: string) {
    super('USER_EXISTS', message);
  }
}
