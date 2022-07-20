import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { AlreadyExistsError, DoesNotExistError } from '../../infrastructure/errors';
import { MovieCreateDTO } from '../../application/dtos';
import { Movie, MovieEntity } from '../entities';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(MovieEntity)
    private readonly repository: Repository<MovieEntity>,
    private readonly i18n: I18nService,
  ) {}

  public findAll(): Promise<Movie[]> {
    return this.repository.find();
  }

  public async findById(lang: string, id: any): Promise<Movie> {
    const found: Movie = await this.repository.findOneBy({ id });

    if (!found) {
      throw new DoesNotExistError(this.i18n.t('test.DOES_NOT_EXIST', { lang }));
    }

    return found;
  }

  public async create(lang: string, dto: MovieCreateDTO): Promise<Movie> {
    const { title, url, description, categories, publishDate } = dto;
    const found: Movie | null = await this.repository.findOneBy({ title });

    if (found) {
      throw new AlreadyExistsError(this.i18n.t('test.ALREADY_EXISTS', { lang }));
    }

    return this.createEntityAndSave({ title, url, description, categories, publishDate });
  }

  public async update(lang: string, dto: MovieCreateDTO): Promise<Movie> {
    const { title, url, description, categories, publishDate } = dto;
    const found: Movie | null = await this.repository.findOneBy({ title });

    if (!found) {
      throw new DoesNotExistError(this.i18n.t('test.DOES_NOT_EXIST', { lang }));
    }

    found.url = url;
    found.description = description;
    found.categories = categories;
    found.publishDate = publishDate;

    return this.repository.save(found);
  }

  private createEntityAndSave({ title, url, description, categories, publishDate }: any): Promise<MovieEntity> {
    const entity: MovieEntity = new MovieEntity();

    entity.title = title;
    entity.url = url;
    entity.description = description;
    entity.categories = categories;
    entity.publishDate = publishDate;

    return this.repository.save(entity);
  }
}
