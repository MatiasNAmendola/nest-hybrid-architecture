import { NestFactory } from '@nestjs/core';
import { SeederModule } from './infrastructure/modules';
import { INestApplication } from '@nestjs/common';
import { ResponseHeadersInterceptor } from './infrastructure/interceptors';

async function bootstrap() {
  // Http Server
  const app: INestApplication = await NestFactory.create(SeederModule);
  app.useGlobalInterceptors(new ResponseHeadersInterceptor());
  await app.init();
}

bootstrap();
