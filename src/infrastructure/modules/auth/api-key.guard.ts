import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { API_KEY } from './auth.constants';

@Injectable()
export class ApiKeyGuard extends AuthGuard(API_KEY) {}
