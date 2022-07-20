import { Response } from 'express';
import { ISSUER } from './auth.helpers';

export function setPoweredBy(response: Response): void {
  response.setHeader('X-Powered-By', ISSUER);
}
