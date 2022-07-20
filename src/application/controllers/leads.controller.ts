import { ApiBadRequestResponse, ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { I18nLang, I18nService } from 'nestjs-i18n';
import { ValidationsService } from '../../infrastructure/modules/validations';
import { HttpExceptionSwagger } from '../../infrastructure/helpers';
import { OpenApiTags } from '../../domain/enums';
import { CrmService } from '../../domain/services';
import { WebsiteContactDTO } from '../dtos';

@ApiBearerAuth()
@ApiTags(OpenApiTags.Leads)
@Controller('leads')
export class LeadsController {
  constructor(
    private readonly service: CrmService,
    private readonly validations: ValidationsService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Save contact data' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Success message',
    type: String,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request response',
    type: () => HttpExceptionSwagger,
  })
  async saveContactData(@I18nLang() lang: string, @Body() body: WebsiteContactDTO): Promise<string> {
    await this.service.saveContactData(body);
    lang = this.validations.getValidLangOrDefault(lang);
    return this.i18n.t('test.THANKS', { lang });
  }
}
