import { faker } from '@faker-js/faker';
import { v4 as uuid } from 'uuid';
import { MovieCreateDTO, MovieGetDTO } from '../../src/application/dtos';
import { Movie, MovieEntity } from '../../src/domain/entities';
import { Categories } from '../../src/domain/enums';

const MaxLengthName = 50;
const MaxLengthDescription = 100;

const { date, internet, lorem, name } = faker;

export const fakeMovie: Movie = {
  id: uuid(),
  title: name.firstName(),
  url: internet.url(),
  description: lorem.word(MaxLengthDescription),
  categories: new Set([
    Categories.Action,
    Categories.Comedy,
    Categories.Drama,
    Categories.Mystery,
    Categories.Romance,
    Categories.Thriller,
  ]),
  publishDate: date.past(),
};

export const fakeMovieEntity: MovieEntity = {
  id: uuid(),
  title: name.firstName(),
  url: internet.url(),
  description: lorem.word(MaxLengthDescription),
  categories: new Set([
    Categories.Action,
    Categories.Comedy,
    Categories.Drama,
    Categories.Mystery,
    Categories.Romance,
    Categories.Thriller,
  ]),
  publishDate: date.past(),
  createdAt: undefined,
  updatedAt: undefined,
};

export const fakeMovieCreate: MovieCreateDTO = {
  title: name.firstName(),
  url: internet.url(),
  description: lorem.word(MaxLengthDescription),
  categories: new Set([
    Categories.Action,
    Categories.Comedy,
    Categories.Drama,
    Categories.Mystery,
    Categories.Romance,
    Categories.Thriller,
  ]),
  publishDate: date.past(),
};

export const fakeMovieMaxLength: MovieCreateDTO = {
  title: lorem.word(MaxLengthName + 1),
  url: lorem.word(MaxLengthDescription + 1),
  categories: new Set([
    Categories.Action,
    Categories.Comedy,
    Categories.Drama,
    Categories.Mystery,
    Categories.Romance,
    Categories.Thriller,
  ]),
};

export const fakeMovieFromEntityDTO = new MovieGetDTO(fakeMovieEntity);
export const fakeMovieDTO = new MovieGetDTO(fakeMovie);
export const fakeMovieCreateDTO = new MovieCreateDTO(fakeMovieCreate);
