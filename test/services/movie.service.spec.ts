import path from 'path';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { I18nModule } from 'nestjs-i18n';
import { MovieCreateDTO } from '../../src/application/dtos';
import { MoviesService } from '../../src/domain/services';
import { Movie, MovieEntity } from '../../src/domain/entities';
import { fakeMovieEntity, fakeMovieFromEntityDTO } from '../factories';

describe('Movie Service', () => {
  let service: MoviesService;

  beforeAll(async () => {
    const mockRepository: Partial<Repository<MovieEntity>> = {
      find: jest.fn(() => Promise.resolve([fakeMovieEntity])),
      findOneBy: jest.fn(() => Promise.resolve(null)),
      save: jest.fn().mockImplementation((_dto: MovieCreateDTO) => Promise.resolve(fakeMovieEntity)),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        I18nModule.forRoot({
          fallbackLanguage: 'en',
          loaderOptions: {
            path: path.join(__dirname, '../../src/i18n/'),
          },
        }),
      ],
      providers: [{ provide: getRepositoryToken(MovieEntity), useValue: mockRepository }, MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  describe('Service status', () => {
    it('Should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('Service test', () => {
    it('List all movies', async () => {
      const result = await service.findAll();

      expect(result).toHaveLength(1);
    });

    it('Create a new movies', async () => {
      const result: Movie = await service.create('en', fakeMovieFromEntityDTO);

      expect(result).toMatchObject(fakeMovieFromEntityDTO);
    });
  });
});
