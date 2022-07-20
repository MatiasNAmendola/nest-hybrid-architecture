import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { I18nLang } from 'nestjs-i18n';
import { RealIP } from 'nestjs-real-ip';
import { BasicOpenApiTags } from '../../infrastructure/config';
import { IndexService } from '../../domain/services';

@ApiTags(BasicOpenApiTags.Main)
@Controller()
export class IndexController {
  constructor(private readonly indexService: IndexService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Index' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Greeting',
    type: String,
  })
  getHello(@I18nLang() lang: string): string {
    return this.indexService.getHello(lang);
  }

  @Get('my-ip')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get my IP' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'My IP',
    type: String,
  })
  get(@RealIP() ip: string): string {
    return ip;
  }
}
