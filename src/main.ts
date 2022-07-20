import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAPIObject } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { join } from 'path';
import { AppModule } from './infrastructure/modules';
import { ResponseHeadersInterceptor } from './infrastructure/interceptors';
import { HttpExceptionFilter } from './infrastructure/filters';
import { CustomValidationPipe } from './infrastructure/pipes';
import { setupReDoc, setupSwagger } from './infrastructure/helpers';
import { AppConfig, getCookieOptions, getNodeOptions } from './infrastructure/config';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();

  app.useGlobalInterceptors(new ResponseHeadersInterceptor());

  // Setup Swagger
  const document: OpenAPIObject = setupSwagger(app);

  // Setup ReDoc
  await setupReDoc(app, document);

  const configService: ConfigService<AppConfig> = app.get(ConfigService);

  const NODE_PORT = getNodeOptions(configService).port;
  const COOKIE_SECRET = getCookieOptions(configService).secret;

  // Validate query params and body
  app.useGlobalPipes(new CustomValidationPipe());

  // Convert exceptions to JSON readable format
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.use(cookieParser(COOKIE_SECRET)); // for cookies signature

  await app.listen(NODE_PORT, () => Logger.log('HTTP Service is listening', 'App'));
}

bootstrap();
