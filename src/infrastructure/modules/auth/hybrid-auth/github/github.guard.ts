import { Injectable, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import merge from 'lodash.merge';
import { GithubAuthGuardOptions, githubGuardDefaultOptions } from './github.types';

@Injectable()
class GithubAuthGuard extends AuthGuard('github') {
  constructor(options?: GithubAuthGuardOptions) {
    super(
      merge(githubGuardDefaultOptions, options, {
        property: 'hybridAuthResult',
      }),
    );
  }
}

export function UseGithubAuth(options?: GithubAuthGuardOptions) {
  return UseGuards(new GithubAuthGuard(options));
}
