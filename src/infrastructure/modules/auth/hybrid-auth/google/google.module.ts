import { GoogleAuthStrategy } from './google.strategy';
import { GoogleAuthModuleOptions } from './google.types';
import { GOOGLE_HYBRID_AUTH_OPTIONS } from './google.constants';
import { createHybridAuthModule, INestHybridAuthModule } from '../core';

export const GoogleAuthModule: INestHybridAuthModule<GoogleAuthModuleOptions> =
  createHybridAuthModule<GoogleAuthModuleOptions>(GOOGLE_HYBRID_AUTH_OPTIONS, GoogleAuthStrategy);
