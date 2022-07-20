import { HybridAuthModuleAsyncOptions } from './hybrid-auth.options';
import { FacebookAuthConfig } from '../facebook';
import { GithubAuthConfig } from '../github';
import { GoogleAuthConfig } from '../google';

export const defaultHybridAuthModuleAsyncOptions: HybridAuthModuleAsyncOptions = {
  facebook: {
    useClass: FacebookAuthConfig,
  },
  github: {
    useClass: GithubAuthConfig,
  },
  google: {
    useClass: GoogleAuthConfig,
  },
};
