import { Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MovieCreateDTO } from '../../application/dtos';
import { Categories } from '../enums';
import { MovieEntity } from '../entities';

const { date, internet, lorem, name } = faker;

@Injectable()
export class MoviesSeederService {
  static MaxLengthDescription = 100;

  constructor(
    @InjectRepository(MovieEntity)
    private readonly repository: Repository<MovieEntity>,
  ) {}

  public async onModuleInit() {
    try {
      const entities: MovieEntity[] = [...Array(100).keys()]
        .map(() => MoviesSeederService.createEntity(MoviesSeederService.createFakeMovie()))
        .map(({ categories, ...m }) => ({ ...m, categories: [...categories] }));

      await this.repository.save(entities);
    } catch (e) {
      console.error(e);
    }
  }

  private static createEntity(dto: MovieCreateDTO): MovieEntity {
    const { title, url, description, categories, publishDate } = dto;
    const entity: MovieEntity = new MovieEntity();

    entity.title = title;
    entity.url = url;
    entity.description = description;
    entity.categories = categories;
    entity.publishDate = publishDate;

    return entity;
  }

  private static createFakeMovie = (): MovieCreateDTO => ({
    title: name.firstName(),
    url: internet.url(),
    description: lorem.word(MoviesSeederService.MaxLengthDescription),
    categories: new Set([
      Categories.Action,
      Categories.Comedy,
      Categories.Drama,
      Categories.Mystery,
      Categories.Romance,
      Categories.Thriller,
    ]),
    publishDate: date.past(),
  });
}
