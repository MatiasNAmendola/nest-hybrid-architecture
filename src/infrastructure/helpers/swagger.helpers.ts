import { INestApplication } from '@nestjs/common';
import { ApiProperty, DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { RedocModule, RedocOptions } from 'nestjs-redoc';
import { TagGroupOptions } from 'nestjs-redoc/dist/interfaces/redocOptions.interface';
import { author, description, version } from '../../../package.json';
import { BasicOpenApiTags } from '../config';
import { OpenApiTags } from '../../domain/enums';

function buildDocument(): Omit<OpenAPIObject, 'paths'> {
  const docBuilder = new DocumentBuilder()
    .setTitle(author)
    .setDescription(description)
    .setVersion(version)
    .addBearerAuth();

  Object.keys(BasicOpenApiTags).forEach((key) => docBuilder.addTag(BasicOpenApiTags[key]));
  Object.keys(OpenApiTags).forEach((key) => docBuilder.addTag(OpenApiTags[key]));
  return docBuilder.build();
}

export function setupSwagger(app: INestApplication): OpenAPIObject {
  const document = SwaggerModule.createDocument(app, buildDocument());
  SwaggerModule.setup('api', app, document);
  return document;
}

export async function setupReDoc(app: INestApplication, document: OpenAPIObject): Promise<void> {
  const basicTagGroup: TagGroupOptions = {
    name: 'Main',
    tags: [],
  };

  Object.keys(BasicOpenApiTags).forEach((key) => basicTagGroup.tags.push(BasicOpenApiTags[key]));

  const tagGroup: TagGroupOptions = {
    name: 'Business',
    tags: [],
  };

  Object.keys(OpenApiTags).forEach((key) => tagGroup.tags.push(OpenApiTags[key]));

  const reDocOptions: RedocOptions = {
    title: author,
    sortPropsAlphabetically: true,
    hideDownloadButton: false,
    hideHostname: false,
    tagGroups: [basicTagGroup, tagGroup],
  };

  // Instead of using SwaggerModule.setup() you call this module
  await RedocModule.setup('/docs', app, document, reDocOptions);
}

class ErrorItemSwagger {
  @ApiProperty({ required: false })
  target?: Record<string, any>;

  @ApiProperty({ required: true })
  property: string;

  @ApiProperty({ required: false })
  value?: any;

  @ApiProperty({ required: false })
  constraints?: {
    [type: string]: string;
  };

  @ApiProperty({ required: false, type: [ErrorItemSwagger] })
  children?: ErrorItemSwagger[];

  @ApiProperty({ required: false })
  contexts?: {
    [type: string]: any;
  };
}

export class HttpExceptionSwagger {
  @ApiProperty({ required: true })
  response: any;

  @ApiProperty({ required: true })
  status: number;

  @ApiProperty({ required: true, type: [ErrorItemSwagger] })
  errors: ErrorItemSwagger[];
}
