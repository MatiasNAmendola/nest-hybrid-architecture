import { ModuleMetadata } from '@nestjs/common/interfaces';
import { AuthOptions } from '../../config';

export interface AuthOptionsAsync extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (...args: any[]) => AuthOptions | Promise<AuthOptions>;
  inject?: any[];
}
