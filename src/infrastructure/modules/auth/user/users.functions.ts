import * as argon2 from 'argon2';
import { User, UserAvailable } from './user.entity';

export function sanitizeUser(obj: User): UserAvailable {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, activationCode, ...sanitized } = obj;
  return sanitized;
}

export function isValidPassword(obj: User, password: string): Promise<boolean> {
  return argon2.verify(obj.password, password);
}

export function encryptPassword(password: string): Promise<string> {
  return argon2.hash(password);
}

export function generateToken(): string {
  return Math.floor(10000 + Math.random() * 90000).toString();
}
