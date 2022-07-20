import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LOCAL_PROVIDER } from './user';

@Injectable()
export class LocalAuthGuard extends AuthGuard(LOCAL_PROVIDER) {}
