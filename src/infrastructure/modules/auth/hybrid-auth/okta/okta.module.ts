import { OktaAuthStrategy } from './okta.strategy';
import { OktaAuthModuleOptions } from './okta.types';
import { OKTA_HYBRID_AUTH_OPTIONS } from './okta.constants';
import { createHybridAuthModule, INestHybridAuthModule } from '../core';

export const OktaAuthModule: INestHybridAuthModule<OktaAuthModuleOptions> =
  createHybridAuthModule<OktaAuthModuleOptions>(OKTA_HYBRID_AUTH_OPTIONS, OktaAuthStrategy);
