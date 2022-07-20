import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { I18nLang } from 'nestjs-i18n';
import { convertToHttpException } from '../../infrastructure/errors';
import { FindByIdParam } from '../../infrastructure/params';
import { HttpExceptionSwagger } from '../../infrastructure/helpers';
import { JwtAuthGuard } from '../../infrastructure/modules/auth';
import { MoviesService } from '../../domain/services';
import { OpenApiTags } from '../../domain/enums';
import { Movie } from '../../domain/entities';
import { MovieCreateDTO, MovieGetDTO } from '../dtos';

@ApiBearerAuth()
@ApiTags(OpenApiTags.Movies)
@ApiUnauthorizedResponse({
  status: HttpStatus.UNAUTHORIZED,
  description: 'Unauthorized response',
  type: () => HttpExceptionSwagger,
})
@UseGuards(JwtAuthGuard)
@Controller('movies')
export class MoviesController {
  constructor(private readonly service: MoviesService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Search movies by ID' })
  @ApiParam({
    name: 'id',
    description: 'Gets the movies id',
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record found',
    type: MovieGetDTO,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request response',
    type: () => HttpExceptionSwagger,
  })
  public async findById(@I18nLang() lang: string, @Param() params: FindByIdParam): Promise<MovieGetDTO> {
    const found = await this.service.findById(lang, params.id);
    return new MovieGetDTO(found);
  }

  @Get()
  @ApiOperation({ summary: 'Get all movies' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The records found',
    type: MovieGetDTO,
    isArray: true,
  })
  public async findAll(): Promise<MovieGetDTO[]> {
    const found = await this.service.findAll();
    return found.map((movie) => new MovieGetDTO(movie));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create movies' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The created record',
    type: MovieGetDTO,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request response',
    type: () => HttpExceptionSwagger,
  })
  public async create(@I18nLang() lang: string, @Body() body: MovieCreateDTO): Promise<MovieGetDTO> {
    try {
      const created: Movie = await this.service.create(lang, body);
      return new MovieGetDTO(created);
    } catch (e) {
      throw convertToHttpException(e);
    }
  }

  @Put()
  @ApiOperation({ summary: 'Update movies' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The updated record',
    type: MovieGetDTO,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.OK,
    description: 'Bad request response',
    type: () => HttpExceptionSwagger,
  })
  public async update(@I18nLang() lang: string, @Body() body: MovieCreateDTO): Promise<MovieGetDTO> {
    try {
      const updated: Movie = await this.service.update(lang, body);
      return new MovieGetDTO(updated);
    } catch (e) {
      throw convertToHttpException(e);
    }
  }
}
