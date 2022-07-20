import { ConfigModuleOptions } from '@nestjs/config';
import { configuration } from './env.objects';
import { validate } from './env.validation';

export const configModuleOptions: ConfigModuleOptions = {
  load: [configuration],
  validate,
  isGlobal: true,
  cache: true,
  expandVariables: true,
};
